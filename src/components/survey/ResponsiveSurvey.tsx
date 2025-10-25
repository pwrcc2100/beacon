'use client';
import { useState, useEffect } from 'react';
import { MobileSurvey } from './MobileSurvey';
import { DesktopSurvey } from './DesktopSurvey';
import { map3to5 } from '@/lib/scoring';

interface ResponsiveSurveyProps {
  onSubmit: (responses: Record<string, number>) => void;
  isSubmitting: boolean;
  onSupportRequest: (data: any) => void;
}

export function ResponsiveSurvey({ onSubmit, isSubmitting, onSupportRequest }: ResponsiveSurveyProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
      setIsLoading(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = (responses: Record<string, number>) => {
    // Convert 3-point scale to 5-point scale for API
    const formattedResponses = {
      sentiment_3: responses.sentiment,
      sentiment_5: map3to5(responses.sentiment),
      clarity_3: responses.clarity,
      clarity_5: map3to5(responses.clarity),
      workload_3: responses.workload,
      workload_5: map3to5(responses.workload),
      safety_3: responses.safety,
      safety_5: map3to5(responses.safety),
      leadership_3: responses.leadership,
      leadership_5: map3to5(responses.leadership),
      meta: { 
        ui_version: 'v4.0', 
        channel: isMobile ? 'mobile' : 'desktop',
        demo_session: true,
        timestamp: new Date().toISOString()
      }
    };

    onSubmit(formattedResponses);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        {isMobile ? (
          <MobileSurvey 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <DesktopSurvey 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onSupportRequest={onSupportRequest}
          />
        )}
      </div>
    </main>
  );
}
