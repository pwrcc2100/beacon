import { redirect } from 'next/navigation';

export default function HomePage() {
  const client = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  if (client) redirect(`/dashboard?client=${client}`);
  redirect('/dashboard');
}

