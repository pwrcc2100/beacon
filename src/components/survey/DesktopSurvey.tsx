'use client';
import { useState } from 'react';
import { Question } from './Question';
import { SupportRequest } from './SupportRequest';

interface DesktopSurveyProps {
  onSubmit: (responses: Record<string, number>) => void;
  isSubmitting: boolean;
  onSupportRequest: (data: any) => void;
}

export function DesktopSurvey({ onSubmit, isSubmitting, onSupportRequest }: DesktopSurveyProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [supportRequested, setSupportRequested] = useState(false);

  const handleSupportRequest = (data: any) => {
    onSupportRequest(data);
    setSupportRequested(true);
  };

  const handleSubmit = () => {
    if (!responses.sentiment || !responses.clarity || !responses.workload || !responses.safety || !responses.leadership) {
      alert('Please answer all questions');
      return;
    }
    onSubmit(responses);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Team Wellbeing Survey</h2>
        <p className="text-gray-600">Your feedback helps us create a better workplace</p>
      </div>

      <Question
        id="sentiment"
        label="Overall Sentiment"
        value={responses.sentiment}
        onChange={(x) => setResponses((s) => ({ ...s, sentiment: x }))}
      />
      <Question
        id="clarity"
        label="Clarity of Expectations"
        value={responses.clarity}
        onChange={(x) => setResponses((s) => ({ ...s, clarity: x }))}
      />
      <Question
        id="workload"
        label="Workload Management"
        value={responses.workload}
        onChange={(x) => setResponses((s) => ({ ...s, workload: x }))}
      />
      <Question
        id="safety"
        label="Safety / Voice"
        value={responses.safety}
        onChange={(x) => setResponses((s) => ({ ...s, safety: x }))}
      />
      <Question
        id="leadership"
        label="Leadership Support"
        value={responses.leadership}
        onChange={(x) => setResponses((s) => ({ ...s, leadership: x }))}
      />

      {/* Support Request Workflow */}
      <SupportRequest onRequestSupport={handleSupportRequest} />

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 backdrop-blur px-4 py-3">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
            style={{ backgroundColor: '#2B4162' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </div>
    </div>
  );
}
