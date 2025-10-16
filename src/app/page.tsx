export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Beacon
        </h1>
        <p className="text-xl text-[var(--text-muted)] mb-8">
          Team Wellbeing Surveys
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Welcome to Beacon
          </h2>
          <p className="text-[var(--text-muted)] mb-4">
            Beacon helps organizations understand team wellbeing through anonymous surveys. 
            Get insights into workload, safety, leadership support, and more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xl mb-2" 
                   style={{ background: 'var(--icon-good)' }}>
                ✓
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">Anonymous</h3>
              <p className="text-sm text-[var(--text-muted)]">Safe, confidential feedback</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xl mb-2" 
                   style={{ background: 'var(--icon-okay)' }}>
                –
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">Simple</h3>
              <p className="text-sm text-[var(--text-muted)]">Quick 5-question surveys</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xl mb-2" 
                   style={{ background: 'var(--icon-attn)' }}>
                △
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">Insights</h3>
              <p className="text-sm text-[var(--text-muted)]">Actionable team analytics</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

