import { supabaseAdmin } from '@/lib/supabase';
import { defaultThresholds } from './defaultThresholds';

export async function getClientConfig(clientId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return defaultThresholds;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('client_config')
      .select('risk_thresholds')
      .eq('client_id', clientId)
      .single();

    if (error || !data) {
      return defaultThresholds;
    }

    return {
      ...defaultThresholds,
      ...data.risk_thresholds,
    };
  } catch {
    return defaultThresholds;
  }
}
