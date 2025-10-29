'use client';
import { useState } from 'react';
import { ResponsiveSurvey } from '@/components/survey/ResponsiveSurvey';

export default function DemoSurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supportRequested, setSupportRequested] = useState(false);
  const [responses, setResponses] = useState<any>(null);

  const handleSupportRequest = (data: any) => {
    console.log('Support request:', data);
    setSupportRequested(true);
    // In a real implementation, this would be sent to your support system
  };

  const handleSubmit = async (surveyResponses: any) => {
    setIsSubmitting(true);
    setResponses(surveyResponses);
    
    try {
      const response = await fetch('/api/demo-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyResponses)
      });

      if (!response.ok) {
        throw new Error('Failed to submit demo response');
      }

      const result = await response.json();
      console.log('Demo response submitted:', result);
      
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
              in the real version, your responses would be sent to your organisation's dashboard.
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
            {responses && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Demo Summary:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Sentiment: {responses.sentiment_3 === 1 ? 'Good' : responses.sentiment_3 === 2 ? 'Okay' : 'Not great'}</div>
                  <div>Clarity: {responses.clarity_3 === 1 ? 'Clear' : responses.clarity_3 === 2 ? 'Mostly clear' : 'Unclear'}</div>
                  <div>Workload: {responses.workload_3 === 1 ? 'Manageable' : responses.workload_3 === 2 ? 'Busy but okay' : 'Unsustainable'}</div>
                  <div>Safety: {responses.safety_3 === 1 ? 'Comfortable' : responses.safety_3 === 2 ? 'Sometimes hesitate' : 'Don\'t feel safe'}</div>
                  <div>Leadership: {responses.leadership_3 === 1 ? 'Supported' : responses.leadership_3 === 2 ? 'Somewhat supported' : 'Not supported'}</div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              You can now view your response on the <a href="/demo-dashboard" className="text-blue-600 hover:underline">Demo Dashboard</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveSurvey 
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onSupportRequest={handleSupportRequest}
    />
  );
}