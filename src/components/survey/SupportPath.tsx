'use client';
import { useState } from 'react';
import { SupportRequestScreen } from './SupportRequestScreen';
import { SupportOptionsScreen } from './SupportOptionsScreen';
import { CrisisResourcesScreen } from './CrisisResourcesScreen';

type SupportPathState = 'request' | 'options' | 'resources' | 'complete';

interface SupportPathProps {
  onComplete: (supportData?: SupportRequestData) => void;
  riskFactors: string[]; // e.g., ['workload', 'safety', 'support']
}

export interface SupportRequestData {
  requested: boolean;
  contacts?: string[];
  contactMethod?: string;
  contactValue?: string;
  timeframe?: string;
  otherDetails?: string;
}

export function SupportPath({ onComplete, riskFactors }: SupportPathProps) {
  const [state, setState] = useState<SupportPathState>('request');
  const [supportData, setSupportData] = useState<SupportRequestData>({ requested: false });

  const handleSupportRequest = (wantsSupport: boolean) => {
    if (wantsSupport) {
      setState('options');
      setSupportData({ ...supportData, requested: true });
    } else {
      // Skip to resources
      setState('resources');
      setSupportData({ ...supportData, requested: false });
    }
  };

  const handleSupportOptionsComplete = (optionsData: SupportRequestData) => {
    setSupportData({ ...supportData, ...optionsData });
    setState('resources');
  };

  const handleResourcesComplete = () => {
    setState('complete');
    onComplete(supportData);
  };

  return (
    <div className="space-y-6">
      {state === 'request' && (
        <SupportRequestScreen
          onRequestSupport={() => handleSupportRequest(true)}
          onSkip={() => handleSupportRequest(false)}
          onTellMeMore={() => {
            // Show info, then ask again
            alert('Available support includes: HR, WHS Leader, Manager, EAP, Union Representative, or Other contacts configured by your organisation.');
          }}
        />
      )}

      {state === 'options' && (
        <SupportOptionsScreen
          onComplete={handleSupportOptionsComplete}
          onCancel={() => setState('request')}
        />
      )}

      {state === 'resources' && (
        <CrisisResourcesScreen
          riskFactors={riskFactors}
          onComplete={handleResourcesComplete}
        />
      )}

      {state === 'complete' && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-700">Processing your responses...</p>
        </div>
      )}
    </div>
  );
}


