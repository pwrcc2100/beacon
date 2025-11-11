'use client';
import { useState } from 'react';
import { MobileSurvey } from './MobileSurvey';
import { SupportPath, SupportRequestData } from './SupportPath';
import { map3to5 } from '@/lib/scoring';

export function SurveyFormWithMobile({ token }: { token: string }) {
  const [showSupportPath, setShowSupportPath] = useState(false);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, 1 | 2 | 3> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMobileSurveyComplete = (surveyResponses: Record<string, 1 | 2 | 3>) => {
    // Detect high-risk responses
    const factors: string[] = [];
    if (surveyResponses.workload === 3) factors.push('workload');
    if (surveyResponses.safety === 3) factors.push('safety');
    if (surveyResponses.leadership === 3) factors.push('support');
    if (surveyResponses.sentiment === 3) factors.push('overall');
    
    setResponses(surveyResponses);
    setRiskFactors(factors);
    
    // Show support path if high-risk detected
    if (factors.length > 0) {
      setShowSupportPath(true);
    } else {
      // Submit directly if no support needed
      submitSurvey(surveyResponses);
    }
  };

  const handleSupportPathComplete = (supportData?: SupportRequestData) => {
    if (responses) {
      submitSurvey(responses, supportData);
    }
  };

  const submitSurvey = async (
    surveyResponses: Record<string, 1 | 2 | 3>, 
    supportData?: SupportRequestData
  ) => {
    setIsSubmitting(true);
    
    try {
      const body = {
        token,
        sentiment_3: surveyResponses.sentiment,
        sentiment_5: map3to5(surveyResponses.sentiment),
        clarity_3: surveyResponses.clarity,
        clarity_5: map3to5(surveyResponses.clarity),
        workload_3: surveyResponses.workload,
        workload_5: map3to5(surveyResponses.workload),
        safety_3: surveyResponses.safety,
        safety_5: map3to5(surveyResponses.safety),
        leadership_3: surveyResponses.leadership,
        leadership_5: map3to5(surveyResponses.leadership),
        // Support path data
        support_requested: supportData?.requested || false,
        support_contacts: supportData?.contacts || [],
        support_contact_method: supportData?.contactMethod,
        support_contact_value: supportData?.contactValue,
        support_timeframe: supportData?.timeframe,
        support_other_details: supportData?.otherDetails,
        high_risk_flag: riskFactors.length > 0,
        risk_factors: riskFactors,
        meta: { ui_version: 'v3.2-mobile', channel: 'web' }
      };

      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }

      // Redirect to thank you page
      window.location.href = '/thanks';
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show support path if triggered
  if (showSupportPath) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Support Available
          </h1>
          <p className="text-[var(--text-muted)]">
            We've detected some areas where you might benefit from support
          </p>
        </div>
        <SupportPath 
          onComplete={handleSupportPathComplete}
          riskFactors={riskFactors}
        />
      </div>
    );
  }

  // Show mobile survey (one question per page)
  return <MobileSurvey onSubmit={handleMobileSurveyComplete} isSubmitting={isSubmitting} />;
}

