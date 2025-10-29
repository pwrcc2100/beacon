'use client';
import { Button } from '@/components/ui/button';

interface SurveyIntroProps {
  onContinue: () => void;
}

export function SurveyIntro({ onContinue }: SurveyIntroProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Beacon Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
          Beacon
        </h1>
        <p className="text-lg font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
          Building healthier workplaces through real insights
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
        <div className="space-y-6">
          {/* Introduction */}
          <div>
            <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Your Feedback Matters
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We'd like to hear from you by participating in this quick <strong>60-second survey</strong>. 
              Your honest responses help us understand workplace wellbeing and create a better environment for everyone.
            </p>
          </div>

          {/* Confidentiality Notice */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6" style={{ color: 'var(--navy)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Your Privacy is Protected
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <strong>Confidentiality:</strong> Your individual responses are completely confidential. 
                  Only aggregated, anonymized data is shared with leadership to identify workplace trends and patterns.
                </p>
                <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Individual responses remain private and anonymous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>Only aggregate data appears in reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>If you request support, only designated contacts are notified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span>This survey is about organisational health, not individual performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              What to Expect
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              This survey takes approximately 60 seconds to complete. You'll answer 5 simple questions 
              about your experience at work. There are no right or wrong answers—just your honest perspective.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <Button
          onClick={onContinue}
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
          style={{ background: 'var(--navy)', color: 'white' }}
        >
          Continue to Survey
        </Button>
      </div>
    </div>
  );
}

