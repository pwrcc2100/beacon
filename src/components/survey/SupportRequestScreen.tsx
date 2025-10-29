'use client';

interface SupportRequestScreenProps {
  onRequestSupport: () => void;
  onSkip: () => void;
  onTellMeMore: () => void;
}

export function SupportRequestScreen({ onRequestSupport, onSkip, onTellMeMore }: SupportRequestScreenProps) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 my-8">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-amber-900 mb-2">
          Thank you for sharing
        </h3>
        
        <p className="text-base text-amber-800">
          Would you like someone to reach out to offer support?
        </p>

        <div className="space-y-3 mt-6">
          <button
            onClick={onRequestSupport}
            className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            ✅ Yes, I'd like to be contacted
          </button>

          <button
            onClick={onTellMeMore}
            className="w-full px-4 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
          >
            ℹ️ Tell me more about available support
          </button>

          <button
            onClick={onSkip}
            className="w-full px-4 py-3 bg-white text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
          >
            ❌ No thanks, I'm managing
          </button>
        </div>

        <p className="text-xs text-amber-700 mt-4">
          Your individual responses remain confidential. We only see aggregated data.
        </p>
      </div>
    </div>
  );
}


