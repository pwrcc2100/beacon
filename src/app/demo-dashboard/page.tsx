'use client';
import { useState, useEffect } from 'react';

interface DemoResponse {
  id: string;
  employee_id: string;
  sentiment_3: number;
  clarity_3: number;
  workload_3: number;
  safety_3: number;
  leadership_3: number;
  created_at: string;
}

export default function DemoDashboard() {
  const [responses, setResponses] = useState<DemoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemoResponses();
    // Refresh every 5 seconds to show new responses
    const interval = setInterval(fetchDemoResponses, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDemoResponses = async () => {
    try {
      const response = await fetch('/api/demo-responses');
      if (response.ok) {
        const data = await response.json();
        setResponses(data.responses || []);
      }
    } catch (error) {
      console.error('Error fetching demo responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWellbeingScore = (response: DemoResponse) => {
    const weights = { sentiment: 0.25, clarity: 0.25, workload: 0.25, safety: 0.15, leadership: 0.10 };
    const score = 
      (response.sentiment_3 * weights.sentiment) +
      (response.clarity_3 * weights.clarity) +
      (response.workload_3 * weights.workload) +
      (response.safety_3 * weights.safety) +
      (response.leadership_3 * weights.leadership);
    
    return Math.round((score / 3) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demo Dashboard</h1>
              <p className="text-gray-600 mt-2">Live responses from demo survey participants</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading demo responses...</div>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 mb-4">No demo responses yet</div>
              <div className="text-sm text-gray-500">
                Have people complete the survey at: <br/>
                <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/survey/test-demo
                </code>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response, index) => {
                const wellbeingScore = calculateWellbeingScore(response);
                return (
                  <div key={response.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Demo User {index + 1}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(response.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(wellbeingScore)}`}>
                          {wellbeingScore}%
                        </div>
                        <div className="text-sm text-gray-600">{getScoreLabel(wellbeingScore)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Sentiment</div>
                        <div className={`font-bold ${response.sentiment_3 === 1 ? 'text-green-600' : response.sentiment_3 === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {response.sentiment_3 === 1 ? 'Good' : response.sentiment_3 === 2 ? 'OK' : 'Struggling'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Clarity</div>
                        <div className={`font-bold ${response.clarity_3 === 1 ? 'text-green-600' : response.clarity_3 === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {response.clarity_3 === 1 ? 'Clear' : response.clarity_3 === 2 ? 'Mostly' : 'Unclear'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Workload</div>
                        <div className={`font-bold ${response.workload_3 === 1 ? 'text-green-600' : response.workload_3 === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {response.workload_3 === 1 ? 'Manageable' : response.workload_3 === 2 ? 'Busy' : 'Unsustainable'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Safety</div>
                        <div className={`font-bold ${response.safety_3 === 1 ? 'text-green-600' : response.safety_3 === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {response.safety_3 === 1 ? 'Safe' : response.safety_3 === 2 ? 'Sometimes' : 'Not Safe'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">Leadership</div>
                        <div className={`font-bold ${response.leadership_3 === 1 ? 'text-green-600' : response.leadership_3 === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {response.leadership_3 === 1 ? 'Supported' : response.leadership_3 === 2 ? 'Somewhat' : 'Not Supported'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Demo Instructions</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Share this URL with demo participants: <code className="bg-gray-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.origin : ''}/survey/test-demo</code></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Each person completes the 2-minute survey</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Their responses appear here automatically (refreshes every 5 seconds)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Show real-time dashboard updates to demonstrate the platform</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✅ Cross-Device Demo:</strong> Responses from any device will appear here! 
              Complete the survey on your phone and refresh this page to see your response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}