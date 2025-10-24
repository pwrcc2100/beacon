export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl mb-4" 
               style={{ background: 'var(--icon-good)' }}>
            ✓
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Thank you!
          </h1>
          <p className="text-[var(--text-muted)]">
            Your feedback has been submitted successfully. Your responses help us create a better workplace for everyone.
          </p>
        </div>
        
        <a href="/" className="inline-block mt-4 px-4 py-2 rounded bg-[var(--navy)] text-white">Return to home</a>
      </div>
    </main>
  );
}

