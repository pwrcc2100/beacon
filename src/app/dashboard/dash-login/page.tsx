import { cookies } from 'next/headers';

export default function DashboardLogin({ searchParams }: { searchParams?: { redirect?: string } }) {
  const redirect = searchParams?.redirect || '/dashboard';
  const isLoggedIn = cookies().get('dash');

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard Admin Login</h1>
          <p className="text-sm text-slate-600">Enter the admin access token to reveal management actions.</p>
          {isLoggedIn && (
            <p className="text-xs text-emerald-600">You are already signed in. Submitting again will refresh your token.</p>
          )}
        </div>

        <form action="/api/dash-login" method="post" className="space-y-4">
          <input
            type="password"
            name="password"
            required
            placeholder="Admin access token"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input type="hidden" name="redirect" value={redirect} />
          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Sign In
          </button>
        </form>
        <p className="text-xs text-center text-slate-500">
          Need help? Check your `.env.local` for <code>ADMIN_DASH_TOKEN</code> or the Vercel project settings.
        </p>
      </div>
    </main>
  );
}


