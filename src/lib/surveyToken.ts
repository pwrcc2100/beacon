import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

export type SurveyAccessResult =
  | { status: 'ok' }
  | { status: 'invalid_format' }
  | { status: 'not_found' }
  | { status: 'expired' }
  | { status: 'already_used' }
  | { status: 'unavailable' };

/**
 * Same rules as POST /api/responses: token must exist, status === 'issued', valid_until in the future.
 */
export async function validateSurveyAccess(token: string): Promise<SurveyAccessResult> {
  const parsed = z.string().uuid().safeParse(token);
  if (!parsed.success) return { status: 'invalid_format' };

  const { data: tok, error } = await supabaseAdmin
    .from('tokens')
    .select('id, status, valid_until')
    .eq('id', token)
    .maybeSingle();

  if (error) {
    console.error('[survey] token lookup failed:', error);
    return { status: 'unavailable' };
  }
  if (!tok) return { status: 'not_found' };
  if (new Date(tok.valid_until) < new Date()) return { status: 'expired' };
  if (tok.status !== 'issued') return { status: 'already_used' };
  return { status: 'ok' };
}
