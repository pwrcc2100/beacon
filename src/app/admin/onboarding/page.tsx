import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { OnboardingForm } from './OnboardingForm';

export default async function AdminOnboardingPage() {
  const authCookie = cookies().get('admin_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/admin/login');
  }

  return (
    <main className="min-h-screen bg-[#f4f4ee]">
      <header className="bg-gradient-to-r from-[#2B4162] to-[#5d89a9] py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MaterialIcon icon="assignment" style={{ fontSize: '40px', color: 'white' }} />
              <div>
                <h1 className="text-3xl font-bold text-white">Beacon Advisory – Client Onboarding</h1>
                <p className="text-white/80 text-sm">Collect every detail required to configure a new advisory engagement.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/materials"
                className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MaterialIcon icon="folder" style={{ fontSize: '20px' }} />
                Materials
              </Link>
              <form action="/api/admin/logout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <MaterialIcon icon="logout" style={{ fontSize: '20px' }} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <section className="bg-white border-l-4 border-[#64afac] rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How to use this form</h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Share this onboarding checklist with new Beacon Advisory clients. Capture hierarchy details, branding, dashboard requirements and delivery cadence so we can configure their environment,
            integrations and reporting workflow ahead of launch. Submissions create a record in Supabase and trigger an email notification to the onboarding team.
          </p>
        </section>

        <OnboardingForm />
      </div>
    </main>
  );
}
