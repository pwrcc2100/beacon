'use client';
import { useState } from 'react';

export default function TestPage() {
  const [clientId, setClientId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const issueToken = async () => {
    if (!clientId) {
      alert('Please enter a client ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/surveys/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          ttl_days: 7,
          channel: 'web'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to issue token' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Beacon Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Issue Survey Token</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Client ID (UUID):</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Paste your client UUID here"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={issueToken}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Issuing...' : 'Issue Token'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.url && (
            <div className="mt-4">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                🚀 Open Survey: {result.url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
