'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin/materials');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2B4162] via-[#5d89a9] to-[#64afac] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MaterialIcon icon="health_and_safety" style={{ fontSize: '48px', color: 'white' }} />
            <h1 className="text-4xl font-bold text-white">Beacon</h1>
          </div>
          <p className="text-white/80">Admin Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon icon="lock" style={{ fontSize: '24px', color: '#2B4162' }} />
              <h2 className="text-2xl font-bold" style={{ color: '#2B4162' }}>Sign In</h2>
            </div>
            <p className="text-sm text-[#737A8C]">
              Enter your admin password to access internal materials and documentation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#2B4162' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#64afac] focus:border-transparent"
                placeholder="Enter admin password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <MaterialIcon icon="error" style={{ fontSize: '20px', color: '#dc2626' }} />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#64afac' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <MaterialIcon icon="progress_activity" style={{ fontSize: '20px' }} />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <a 
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-[#737A8C] hover:text-[#2B4162] transition-colors"
            >
              <MaterialIcon icon="arrow_back" style={{ fontSize: '16px' }} />
              Back to Home
            </a>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white text-xs">
            <MaterialIcon icon="shield" style={{ fontSize: '16px' }} />
            Secure admin area - Authorized personnel only
          </div>
        </div>
      </div>
    </main>
  );
}





