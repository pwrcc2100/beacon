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
    console.log('🟢 Button clicked! Generating demo data...', { endpoint, clientId });
    setLoading(true);
    setMessage('');
    
    try {
      console.log(`📡 Making API request to /api/demo/${endpoint}`);
      // Fetch with cookies - the API will check the 'dash' cookie set during login
      const response = await fetch(`/api/demo/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies for same-origin requests
        body: JSON.stringify({ client_id: clientId })
      });

      console.log('📥 Got response, status:', response.status);
      const data = await response.json();
      
      // Log full response for debugging
      console.log('✅ Demo data generation response:', data);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please make sure you are logged in to the dashboard.');
        }
        throw new Error(data.error || 'Failed to generate demo data');
      }

      // Build detailed message
      const inserted = data.inserted || data.verifiedInDatabase || (data.ok ? 'demo data' : 0);
      const verified = data.verifiedInDatabase !== undefined ? ` (${data.verifiedInDatabase} verified in database)` : '';
      const employeesInfo = data.employeesWithDivision !== undefined ? ` | ${data.employeesWithDivision} employees with divisions` : '';
      const structure = data.structure ? ` | Structure: ${data.structure.divisions} divisions, ${data.structure.departments} departments, ${data.structure.teams} teams` : '';
      
      let successMessage = `✅ Success! Generated ${inserted} records${verified}${employeesInfo}${structure}.`;
      
      if (data.errors && data.errors.length > 0) {
        console.warn('Some batches had errors:', data.errors);
        successMessage = `⚠️ Generated ${inserted} records but some had errors: ${data.errors.join('; ')}`;
      }
      
      // Show warning if employees don't have division_id
      if (data.employeesWithDivision === 0 && data.verifiedInDatabase > 0) {
        console.warn('⚠️ Employees created but division_id not set - hierarchy data won\'t show!');
        successMessage = `⚠️ ${data.verifiedInDatabase} responses created but employees missing division_id. Data may not display in hierarchy view.`;
      }
      
      setMessage(successMessage);
      
      // Refresh the page after a longer delay to show new data and allow user to read message
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      
    } catch (error: any) {
      console.error('❌ Error generating demo data:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 Handler finished');
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

