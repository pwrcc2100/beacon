'use client';
import { useState } from 'react';
import { Question } from '@/components/survey/Question';
import { SupportRequest } from '@/components/survey/SupportRequest';
import { map3to5 } from '@/lib/scoring';

export default function DemoSurveyPage() {
  const [v, setV] = useState<
    Partial<Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', 1 | 2 | 3>>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supportRequested, setSupportRequested] = useState(false);

  const handleSupportRequest = (data: any) => {
    console.log('Support request:', data);
    setSupportRequested(true);
    // In a real implementation, this would be sent to your support system
  };

  const submit = async () => {
    if (!v.sentiment || !v.clarity || !v.workload || !v.safety || !v.leadership) {
      alert('Please answer all questions');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const body = {
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
        meta: { 
          ui_version: 'v3.0', 
          channel: 'web',
          demo_session: true,
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetch('/api/demo-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to submit demo response');
      }

      const result = await response.json();
      console.log('Demo response submitted:', result);
      
      // Store the response in localStorage for the demo dashboard
      if (result.response) {
        try {
          const existingResponses = JSON.parse(localStorage.getItem('beacon-demo-responses') || '[]');
          existingResponses.push(result.response);
          localStorage.setItem('beacon-demo-responses', JSON.stringify(existingResponses));
        } catch (error) {
          console.error('Error storing demo response:', error);
        }
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-6">
              Your responses have been recorded. This was a demo survey - 
              in the real version, your responses would be sent to your organization's dashboard.
            </p>
            {supportRequested && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="text-green-800 font-medium mb-2">✅ Support Request Submitted</div>
                <div className="text-sm text-green-700">
                  Your support request has been logged. In a real implementation, 
                  your chosen contact person would be notified immediately.
                </div>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Demo Summary:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Sentiment: {v.sentiment === 1 ? 'Low' : v.sentiment === 2 ? 'Medium' : 'High'}</div>
                <div>Clarity: {v.clarity === 1 ? 'Low' : v.clarity === 2 ? 'Medium' : 'High'}</div>
                <div>Workload: {v.workload === 1 ? 'Low' : v.workload === 2 ? 'Medium' : 'High'}</div>
                <div>Safety: {v.safety === 1 ? 'Low' : v.safety === 2 ? 'Medium' : 'High'}</div>
                <div>Leadership: {v.leadership === 1 ? 'Low' : v.leadership === 2 ? 'Medium' : 'High'}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setV({});
                setSubmitted(false);
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 space-y-6 pb-24">
        <div className="text-center mb-8">
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
            <h1 className="text-lg font-bold text-blue-900 mb-2">
              📱 Demo Survey
            </h1>
            <p className="text-sm text-blue-800">
              This is how employees experience the Beacon survey on their mobile device.
              Takes 2 minutes, completely confidential.
            </p>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Team Wellbeing Survey
          </h2>
          <p className="text-gray-600">
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

        {/* Support Request Workflow */}
        <SupportRequest onRequestSupport={handleSupportRequest} />

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 backdrop-blur px-4 py-3">
          <div className="max-w-xl mx-auto">
            <button
              onClick={submit}
              disabled={isSubmitting}
              className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
              style={{ background: '#2B4162' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
