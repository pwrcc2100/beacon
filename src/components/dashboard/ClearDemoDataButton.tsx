'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ClearDemoDataButtonProps = {
  clientId: string;
};

export function ClearDemoDataButton({ clientId }: ClearDemoDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClear = async () => {
    if (!confirm('Are you sure you want to delete all demo data? This will remove all employees and responses with "demo" in their email.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/demo/clear?client_id=${clientId}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Cleared ${result.employeesDeleted || 0} employees and ${result.responsesDeleted || 0} responses`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(`❌ Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to clear demo data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClear}
        disabled={loading}
        variant="destructive"
        size="sm"
        className="w-full"
      >
        {loading ? 'Clearing...' : 'Clear Demo Data'}
      </Button>
      {message && (
        <p className="text-xs text-[var(--text-muted)]">{message}</p>
      )}
    </div>
  );
}

