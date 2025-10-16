'use client';
import { useState } from 'react';
import { Question } from './Question';
import { map3to5 } from '@/lib/scoring';

export function SurveyForm({ token }: { token: string }) {
  const [v, setV] = useState<
    Partial<Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', 1 | 2 | 3>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
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
        meta: { ui_version: 'v3.0', channel: 'web' }
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Team Wellbeing Survey
        </h1>
        <p className="text-[var(--text-muted)]">
          Your feedback helps us create a better workplace
        </p>
      </div>

      <Question
        id="sentiment"
        label="Sentiment / Overall"
        value={v.sentiment}
        onChange={(x) => setV((s) => ({ ...s, sentiment: x }))}
      />
      <Question
        id="clarity"
        label="Clarity / Direction"
        value={v.clarity}
        onChange={(x) => setV((s) => ({ ...s, clarity: x }))}
      />
      <Question
        id="workload"
        label="Workload / Capacity"
        value={v.workload}
        onChange={(x) => setV((s) => ({ ...s, workload: x }))}
      />
      <Question
        id="safety"
        label="Safety / Voice"
        value={v.safety}
        onChange={(x) => setV((s) => ({ ...s, safety: x }))}
      />
      <Question
        id="leadership"
        label="Leadership Support"
        value={v.leadership}
        onChange={(x) => setV((s) => ({ ...s, leadership: x }))}
      />

      <button
        onClick={submit}
        disabled={isSubmitting}
        className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
        style={{ background: 'var(--navy)' }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Survey'}
      </button>
    </div>
  );
}

