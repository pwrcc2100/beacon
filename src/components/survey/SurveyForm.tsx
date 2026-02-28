'use client';
import { useState, useEffect } from 'react';
import { Question } from './Question';
import { SupportPath, SupportRequestData } from './SupportPath';
import { map3to5, normaliseSurveyResponses } from '@/lib/scoring';

export function SurveyForm({ token }: { token: string }) {
  const [v, setV] = useState<
    Partial<Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', 1 | 2 | 3>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupportPath, setShowSupportPath] = useState(false);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [supportData, setSupportData] = useState<SupportRequestData | undefined>();
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // Check if all questions are answered
  useEffect(() => {
    const allAnswered = v.sentiment && v.clarity && v.workload && v.safety && v.leadership;
    setAllQuestionsAnswered(!!allAnswered);
    
    if (allAnswered) {
      // Detect high-risk responses (value === 3 = struggling/unsustainable/not safe/not supported)
      const factors: string[] = [];
      if (v.workload === 3) factors.push('workload');
      if (v.safety === 3) factors.push('safety');
      if (v.leadership === 3) factors.push('support');
      if (v.sentiment === 3) factors.push('overall');
      
      setRiskFactors(factors);
      // Show support path if any high-risk indicators
      setShowSupportPath(factors.length > 0);
    }
  }, [v]);

  const handleSupportPathComplete = (data?: SupportRequestData) => {
    setSupportData(data);
    handleSubmit(data);
  };

  const handleSubmit = async (supportData?: SupportRequestData) => {
    if (!v.sentiment || !v.clarity || !v.workload || !v.safety || !v.leadership) {
      alert('Please answer all questions');
      return;
    }

    const safe = normaliseSurveyResponses(v as Record<string, unknown>);
    setIsSubmitting(true);
    try {
      const body = {
        token,
        sentiment_3: safe.sentiment,
        sentiment_5: map3to5(safe.sentiment),
        clarity_3: safe.clarity,
        clarity_5: map3to5(safe.clarity),
        workload_3: safe.workload,
        workload_5: map3to5(safe.workload),
        safety_3: safe.safety,
        safety_5: map3to5(safe.safety),
        leadership_3: safe.leadership,
        leadership_5: map3to5(safe.leadership),
        support_requested: supportData?.requested ?? false,
        support_contacts: Array.isArray(supportData?.contacts) ? supportData.contacts : [],
        support_contact_method: supportData?.contactMethod ?? undefined,
        support_contact_value: supportData?.contactValue ?? undefined,
        support_timeframe: supportData?.timeframe ?? undefined,
        support_other_details: supportData?.otherDetails ?? undefined,
        high_risk_flag: riskFactors.length > 0,
        risk_factors: riskFactors,
        meta: { ui_version: 'v3.1', channel: 'web' }
      };

      const isDemoLog = typeof window !== 'undefined' && window.location.search.includes('log=1');
      if (isDemoLog) {
        console.log('[Beacon Survey] Submitting payload:', JSON.stringify(body, null, 2));
      }

      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (isDemoLog) {
        console.log('[Beacon Survey] Response status:', response.status, response.statusText);
        const clone = response.clone();
        clone.text().then((t) => {
          try {
            console.log('[Beacon Survey] Response body:', JSON.parse(t));
          } catch {
            console.log('[Beacon Survey] Response body (raw):', t?.slice(0, 500));
          }
        });
      }

      if (!response.ok) {
        let message = 'Something went wrong. Please try again.';
        try {
          const errorData = await response.json();
          if (errorData?.error === 'invalid_or_expired_token') {
            message = 'This survey link has expired or is invalid. Please request a new link from your organisation.';
          } else if (typeof errorData?.details === 'string') message = errorData.details;
          else if (typeof errorData?.error === 'string') message = errorData.error;
        } catch {
          if (response.status >= 500) message = 'Our system is temporarily busy. Please try again in a moment.';
        }
        throw new Error(message);
      }

      window.location.href = '/thanks';
    } catch (error) {
      console.error('[Beacon Survey] Submission error:', error);
      if (typeof window !== 'undefined' && window.location.search.includes('log=1')) {
        console.error('[Beacon Survey] Error details:', error instanceof Error ? error.message : String(error));
      }
      alert(error instanceof Error ? error.message : 'Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show support path if high-risk detected
  if (showSupportPath && allQuestionsAnswered) {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Support Available
          </h1>
          <p className="text-[var(--text-muted)]">
            We've detected some areas where you might benefit from support
          </p>
        </div>

        <SupportPath 
          onComplete={handleSupportPathComplete}
          riskFactors={riskFactors}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Beacon Index Survey
        </h1>
        <p className="text-[var(--text-muted)]">
          Your feedback helps us create a better workplace
        </p>
      </div>

      <Question
        id="sentiment"
        label="Domain 1 · Experience · Q1"
        value={v.sentiment}
        onChange={(x) => setV((s) => ({ ...s, sentiment: x }))}
      />
      <Question
        id="workload"
        label="Domain 2 · Workload & Resourcing · Q2"
        value={v.workload}
        onChange={(x) => setV((s) => ({ ...s, workload: x }))}
      />
      <Question
        id="safety"
        label="Domain 3 · Psychological Safety · Q3"
        value={v.safety}
        onChange={(x) => setV((s) => ({ ...s, safety: x }))}
      />
      <Question
        id="leadership"
        label="Domain 4 · Leadership & Support · Q4"
        value={v.leadership}
        onChange={(x) => setV((s) => ({ ...s, leadership: x }))}
      />
      <Question
        id="clarity"
        label="Domain 5 · Clarity & Direction · Q5"
        value={v.clarity}
        onChange={(x) => setV((s) => ({ ...s, clarity: x }))}
      />

      <div className="fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white/90 backdrop-blur px-4 py-3">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !allQuestionsAnswered}
            className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
            style={{ background: 'var(--navy)' }}
          >
            {isSubmitting ? 'Submitting...' : allQuestionsAnswered ? 'Submit Survey' : 'Answer all questions to continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

