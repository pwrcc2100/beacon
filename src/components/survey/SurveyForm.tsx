'use client';
import { useState, useEffect, useMemo } from 'react';
import { Question } from './Question';
import { SupportPath, SupportRequestData } from './SupportPath';
import { map3to5 } from '@/lib/scoring';

const QUESTION_ORDER = [
  { id: 'sentiment', label: 'Domain 1 · General Sentiment (25%)' },
  { id: 'clarity', label: 'Domain 2 · Clarity & Direction (20%)' },
  { id: 'workload', label: 'Domain 3 · Workload & Resourcing (20%)' },
  { id: 'safety', label: 'Domain 4 · Psychological Safety (20%)' },
  { id: 'leadership', label: 'Domain 5 · Leadership & Support (15%)' }
] as const;

type QuestionId = (typeof QUESTION_ORDER)[number]['id'];

export function SurveyForm({ token }: { token: string }) {
  const [v, setV] = useState<Partial<Record<QuestionId, 1 | 2 | 3>>>({});
  const [step, setStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupportPath, setShowSupportPath] = useState(false);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  const totalSteps = QUESTION_ORDER.length;
  const currentQuestion = useMemo(() => QUESTION_ORDER[step], [step]);

  // Check if all questions are answered
  useEffect(() => {
    const allAnswered = QUESTION_ORDER.every(({ id }) => v[id]);
    setAllQuestionsAnswered(allAnswered);
    
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
    handleSubmit(data);
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
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
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setShowSupportPath(false);
              setStep(totalSteps - 1);
            }}
            className="text-sm font-medium text-[var(--navy)] hover:underline"
          >
            ← Back to survey
          </button>
          <div className="text-xs text-[var(--text-muted)]">Support options</div>
        </div>

        <div className="text-center mb-4">
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

  const isFinalStep = step === totalSteps - 1;
  const currentValue = v[currentQuestion.id];
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Team Wellbeing Survey
        </h1>
        <p className="text-[var(--text-muted)]">
          Your feedback helps us create a better workplace
        </p>
        <div>
          <div className="h-2 w-full rounded-full bg-black/10">
            <div
              className="h-2 rounded-full"
              style={{ width: `${progress}%`, background: 'var(--navy)' }}
            />
          </div>
          <div className="mt-1 text-xs text-[var(--text-muted)]">
            Question {step + 1} of {totalSteps}
          </div>
        </div>
      </div>

      <Question
        id={currentQuestion.id}
        label={currentQuestion.label}
        value={currentValue}
        onChange={(value) => setV((state) => ({ ...state, [currentQuestion.id]: value }))}
      />

      <div className="flex items-center justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className="flex-1 rounded-lg border border-black/10 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (isFinalStep) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
          disabled={!currentValue || (isFinalStep && (isSubmitting || !allQuestionsAnswered))}
          className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--navy)' }}
        >
          {isFinalStep ? (isSubmitting ? 'Submitting…' : 'Submit Survey') : 'Next'}
        </button>
      </div>
    </div>
  );
}

