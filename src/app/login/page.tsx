'use client';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sendLink = async (e:React.FormEvent)=>{
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: window.location.origin + '/dashboard' } });
    if(!error) setSent(true);
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-black/5 w-full max-w-md">
        <h1 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Admin sign‑in</h1>
        <p className="text-sm text-[var(--text-muted)] mb-4">Enter your email to receive a one‑time sign‑in link.</p>
        {sent ? (
          <div className="text-sm text-[var(--text-primary)]">Check your inbox for the sign‑in link.</div>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <input type="email" required placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2"/>
            <button className="px-3 py-2 bg-[var(--navy)] text-white rounded w-full">Send link</button>
          </form>
        )}
      </div>
    </main>
  );
}



