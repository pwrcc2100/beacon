'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  clientId?: string;
  compact?: boolean;
};

export function DemoQRCode({ clientId = '', compact = false }: Props) {
  const [token, setToken] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [surveyUrl, setSurveyUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed in compact mode
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const generateNewToken = async () => {
    if (!clientId) {
      alert('Client ID is required to generate survey tokens');
      return;
    }

    setIsGenerating(true);
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
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate token');
      }

      const newToken = data.token;
      const url = `${baseUrl}/survey/${newToken}`;
      
      setToken(newToken);
      setSurveyUrl(url);
      
      // Generate QR code
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrUrl(qrCodeApiUrl);
      setIsExpanded(true); // Auto-expand when QR code is generated
    } catch (error: any) {
      alert(`Error generating survey token: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Compact version for sidebar
  if (compact) {
    if (!token) {
      return (
        <div className="border border-[var(--navy)]/20 rounded-lg p-3 bg-[var(--navy)]/5">
          <div className="text-xs font-semibold text-[var(--navy)] mb-2 flex items-center gap-1">
            <span>📱</span> Demo QR Code
          </div>
          <Button
            onClick={generateNewToken}
            disabled={isGenerating || !clientId}
            variant="outline"
            size="sm"
            className="w-full text-xs h-8"
          >
            {isGenerating ? 'Generating...' : 'Generate QR'}
          </Button>
          {!clientId && (
            <p className="text-xs text-muted-foreground mt-2">Set client ID to enable</p>
          )}
        </div>
      );
    }

    return (
      <div className="border border-[var(--navy)]/20 rounded-lg p-3 bg-white">
        <div className="text-xs font-semibold text-[var(--navy)] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span>📱</span> Demo QR Code
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--navy)] hover:text-[var(--navy)]/80 text-xs font-bold"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {isExpanded && qrUrl && (
          <div className="space-y-2">
            <div className="flex justify-center bg-white p-2 rounded border border-gray-200">
              <img 
                src={qrUrl} 
                alt="QR Code" 
                className="w-32 h-32"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewToken}
              disabled={isGenerating}
              className="w-full text-xs h-7"
            >
              {isGenerating ? 'Generating...' : 'New QR Code'}
            </Button>
            <button
              onClick={() => copyToClipboard(surveyUrl)}
              className="w-full text-xs text-muted-foreground hover:text-foreground underline text-left"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full version (original) - not used anymore but keeping for reference
  if (!token) {
    return (
      <Card className="border-2 border-[var(--navy)] shadow" style={{ background: 'var(--navy)', color: 'white' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <span>📱</span> Demo Survey QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={generateNewToken}
            disabled={isGenerating}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ background: 'var(--navy)', color: 'white' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">📱 Demo Survey QR Code</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {qrUrl && token && (
            <>
              <div className="flex justify-center bg-white p-4 rounded-lg">
                <img 
                  src={qrUrl} 
                  alt="QR Code" 
                  className="border-4 border-gray-200 rounded-lg max-w-[250px] w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-white text-xs mb-1 block">Survey URL:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={surveyUrl}
                      readOnly
                      className="font-mono text-sm bg-white/90"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(surveyUrl)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={generateNewToken}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? 'Generating...' : 'Generate New Token'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(surveyUrl, '_blank')}
                    className="flex-1 bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    Preview Survey
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
