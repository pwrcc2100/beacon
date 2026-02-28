'use client';
import { useState } from 'react';
import { MobileSurvey } from './MobileSurvey';
import { SupportPath, SupportRequestData } from './SupportPath';
import { map3to5, isValidSurveyResponses, normaliseSurveyResponses } from '@/lib/scoring';

export function SurveyFormWithMobile({ token }: { token: string }) {
  const [showSupportPath, setShowSupportPath] = useState(false);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, 1 | 2 | 3> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMobileSurveyComplete = (surveyResponses: Record<string, 1 | 2 | 3>) => {
    // Ensure we always have valid 1|2|3 for all five dimensions (handles any edge case)
    const safe = isValidSurveyResponses(surveyResponses)
      ? surveyResponses
      : normaliseSurveyResponses(surveyResponses as Record<string, unknown>);
    setResponses(safe);

    const factors: string[] = [];
    if (safe.workload === 3) factors.push('workload');
    if (safe.safety === 3) factors.push('safety');
    if (safe.leadership === 3) factors.push('support');
    if (safe.sentiment === 3) factors.push('overall');
    setRiskFactors(factors);

    if (factors.length > 0) {
      setShowSupportPath(true);
    } else {
      submitSurvey(safe);
    }
  };

  const handleSupportPathComplete = (supportData?: SupportRequestData) => {
    if (responses) {
      submitSurvey(responses, supportData);
    }
  };

  const submitSurvey = async (
    surveyResponses: Record<string, 1 | 2 | 3>,
    supportData?: SupportRequestData
  ) => {
    const safe = isValidSurveyResponses(surveyResponses)
      ? surveyResponses
      : normaliseSurveyResponses(surveyResponses as Record<string, unknown>);

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
        meta: { ui_version: 'v3.2-mobile', channel: 'web' }
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
          const code = errorData?.error;
          if (code === 'invalid_or_expired_token') {
            message = 'This survey link has expired or is invalid. Please request a new link from your organisation.';
          } else if (typeof errorData?.details === 'string') {
            message = errorData.details;
          } else if (typeof errorData?.error === 'string') {
            message = errorData.error;
          }
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

  // Show support path if triggered
  if (showSupportPath) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
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

  // Show mobile survey (one question per page)
  return <MobileSurvey onSubmit={handleMobileSurveyComplete} isSubmitting={isSubmitting} />;
}

