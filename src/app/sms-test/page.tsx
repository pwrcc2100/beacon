'use client';
import { useState, useEffect } from 'react';

export default function SMSTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  useEffect(() => {
    // Check Twilio configuration status
    fetch('/api/sms/test')
      .then(res => res.json())
      .then(data => setConfigStatus(data))
      .catch(err => console.error('Config check failed:', err));
  }, []);

  const sendTestSMS = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Failed to send SMS' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">📱 SMS Test Page</h1>
          
          {/* Twilio Configuration Status */}
          <div className="mb-6 p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Twilio Configuration</h2>
            {configStatus ? (
              <div className={`p-3 rounded ${configStatus.twilioConfigured ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`font-medium ${configStatus.twilioConfigured ? 'text-green-800' : 'text-red-800'}`}>
                  {configStatus.twilioConfigured ? '✅ Configured' : '❌ Not Configured'}
                </div>
                <div className={`text-sm mt-1 ${configStatus.twilioConfigured ? 'text-green-700' : 'text-red-700'}`}>
                  {configStatus.message}
                </div>
                {configStatus.missing && configStatus.missing.length > 0 && (
                  <div className="text-sm text-red-600 mt-2">
                    Missing: {configStatus.missing.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Checking configuration...</div>
            )}
          </div>

          {/* SMS Test Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Australian Mobile Number:
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+61412345678"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: +61xxxxxxxxx (Australian mobile number)
              </p>
            </div>
            
            <button
              onClick={sendTestSMS}
              disabled={loading || !configStatus?.twilioConfigured}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {loading ? 'Sending...' : 'Send Test SMS'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-green-800 font-medium">✅ SMS sent successfully!</div>
                <div className="text-sm text-green-700 mt-1">
                  Check your phone for the survey link
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demo Links */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Demo Links</h2>
          <div className="space-y-3">
            <div>
              <a
                href="/survey/test-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">📱 Demo Survey</div>
                <div className="text-sm text-blue-700">Experience the survey on mobile</div>
              </a>
            </div>
            <div>
              <a
                href="/test"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="font-medium text-green-900">🔗 Token Generator</div>
                <div className="text-sm text-green-700">Generate survey tokens for testing</div>
              </a>
            </div>
            <div>
              <a
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="font-medium text-purple-900">📊 Dashboard</div>
                <div className="text-sm text-purple-700">View survey results and analytics</div>
              </a>
            </div>
          </div>
        </div>

        {/* Public URL Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🌐 Public Access</h3>
          <p className="text-sm text-yellow-800 mb-2">
            Your survey is accessible from anywhere via:
          </p>
          <div className="bg-white p-2 rounded border font-mono text-sm">
            https://beacon-survey-demo.loca.lt
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Share this URL with clients to demo the survey on their mobile devices
          </p>
        </div>
      </div>
    </div>
  );
}

