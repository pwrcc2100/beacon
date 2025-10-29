'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  clientId: string;
  endpoint: 'seed' | 'seed-with-departments';
  label: string;
};

export function GenerateDemoDataButton({ clientId, endpoint, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Fetch with cookies - the API will check the 'dash' cookie set during login
      const response = await fetch(`/api/demo/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies for same-origin requests
        body: JSON.stringify({ client_id: clientId })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please make sure you are logged in to the dashboard.');
        }
        throw new Error(data.error || 'Failed to generate demo data');
      }

      setMessage(`✅ Success! Generated ${data.inserted || data.ok ? 'demo data' : '0'} records.`);
      
      // Refresh the page after a short delay to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : label}
      </Button>
      {message && (
        <span className={`text-xs ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </span>
      )}
    </div>
  );
}

