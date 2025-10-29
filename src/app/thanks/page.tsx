export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* Beacon Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Beacon
          </h1>
          <p className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>
            Building healthier workplaces through real insights
          </p>
        </div>

        {/* Thank You Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5 mb-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl mb-4" 
                 style={{ background: 'var(--icon-good)' }}>
              ✓
            </div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Thank You!
            </h2>
            <p className="text-base leading-relaxed text-[var(--text-muted)] mb-4">
              Your feedback has been submitted successfully.
            </p>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              Your honest responses help us understand workplace wellbeing and create a better environment for everyone. 
              We truly appreciate you taking the time to share your perspective.
            </p>
          </div>

          {/* Next Steps Info */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
              What Happens Next?
            </h3>
            <ul className="text-sm text-left space-y-2 text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Your responses are combined with others to identify trends and patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>Leadership receives aggregated insights (your individual responses remain confidential)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>If you requested support, someone will reach out to you within the timeframe you specified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span>You'll receive future surveys to continue tracking wellbeing over time</span>
              </li>
            </ul>
          </div>
        </div>
        
        <a 
          href="/" 
          className="inline-block mt-4 px-6 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: 'var(--navy)' }}
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}

