'use client';
import { useState, useEffect } from 'react';
import { Question } from './Question';
import { SupportPath, SupportRequestData } from './SupportPath';
import { map3to5 } from '@/lib/scoring';

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

    setIsSubmitting(true);
    
    try {
      const body = {
        token,
        sentiment_3: v.sentiment,
        sentiment_5: map3to5(v.sentiment),
        clarity_3: v.clarity,
        clarity_5: map3to5(v.clarity),
        workload_3: v.workload,
        workload_5: map3to5(v.workload),
        safety_3: v.safety,
        safety_5: map3to5(v.safety),
        leadership_3: v.leadership,
        leadership_5: map3to5(v.leadership),
        // Add support request data if provided
        support_requested: supportData?.requested || false,
        support_contacts: supportData?.contacts || [],
        support_contact_method: supportData?.contactMethod,
        support_contact_value: supportData?.contactValue,
        support_timeframe: supportData?.timeframe,
        support_other_details: supportData?.otherDetails,
        high_risk_flag: riskFactors.length > 0,
        risk_factors: riskFactors,
        meta: { ui_version: 'v3.1', channel: 'web' }
      };

      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      window.location.href = '/thanks';
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit survey. Please try again.');
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

