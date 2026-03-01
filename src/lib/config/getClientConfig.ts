import { supabase } from '@/lib/supabase';
import { defaultThresholds } from './defaultThresholds';

export async function getClientConfig(clientId: string) {
  const { data, error } = await supabase
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
}
