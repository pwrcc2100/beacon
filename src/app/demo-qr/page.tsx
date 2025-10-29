'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DemoQRPage() {
  const [token, setToken] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(
    typeof window !== 'undefined' ? window.location.origin : ''
  );

  const generateQRCode = async () => {
    const demoToken = token || `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const surveyUrl = `${baseUrl}/survey/${demoToken}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(surveyUrl)}`;
    setQrUrl(qrCodeApiUrl);
    setToken(demoToken);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Beacon Demo QR Code Generator
          </h1>
          <p className="text-muted-foreground">
            Generate a QR code for your executive demo survey
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-domain.com"
              />
            </div>
            
            <div>
              <Label htmlFor="token">Survey Token (leave empty to generate new)</Label>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="demo-token-123 or leave empty"
              />
            </div>

            <Button onClick={generateQRCode} className="w-full" style={{ background: 'var(--navy)' }}>
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrUrl && token && (
          <Card>
            <CardHeader>
              <CardTitle>Your Demo Survey QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <img src={qrUrl} alt="QR Code" className="border-4 border-gray-200 rounded-lg" />
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label>Survey URL:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${baseUrl}/survey/${token}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(`${baseUrl}/survey/${token}`)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Token:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={token}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(token)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-900">Instructions for Demo:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>Print or display this QR code during your presentation</li>
                  <li>Participants scan the QR code with their phone camera</li>
                  <li>They complete the 60-second survey</li>
                  <li>After submission, show their individual data on the participant view page</li>
                  <li>Refresh the dashboard to see the new response appear in real-time</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`${baseUrl}/survey/${token}`, '_blank')}
                  className="flex-1"
                >
                  Preview Survey
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`${baseUrl}/participant/${token}`, '_blank')}
                  className="flex-1"
                >
                  View Participant Page
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
