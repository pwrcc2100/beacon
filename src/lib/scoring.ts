// src/lib/scoring.ts

/** Clamp to valid 3-point scale so any input is safe (handles edge cases / bad data). */
function clamp3(v: number): 1 | 2 | 3 {
  if (typeof v !== 'number' || Number.isNaN(v)) return 2;
  if (v <= 1) return 1;
  if (v >= 3) return 3;
  return 2;
}

/** Map 3-point scale (1=best, 3=worst) to 5-point (1=worst, 5=best). Defensive: accepts any number. */
export const map3to5 = (v: number): 1 | 3 | 5 => {
  const c = clamp3(v);
  if (c === 1) return 5;
  if (c === 2) return 3;
  return 1;
};

export type SurveyResponse3 = {
  sentiment: 1 | 2 | 3;
  clarity: 1 | 2 | 3;
  workload: 1 | 2 | 3;
  safety: 1 | 2 | 3;
  leadership: 1 | 2 | 3;
};

export type SurveyResponse5 = {
  sentiment: 1 | 3 | 5;
  clarity: 1 | 3 | 5;
  workload: 1 | 3 | 5;
  safety: 1 | 3 | 5;
  leadership: 1 | 3 | 5;
};

export const mapSurveyResponse = (response: SurveyResponse3): SurveyResponse5 => ({
  sentiment: map3to5(response.sentiment),
  clarity: map3to5(response.clarity),
  workload: map3to5(response.workload),
  safety: map3to5(response.safety),
  leadership: map3to5(response.leadership),
});

const REQUIRED_KEYS = ['sentiment', 'clarity', 'workload', 'safety', 'leadership'] as const;

/** Returns true if obj has all five dimensions and each is 1, 2, or 3. */
export function isValidSurveyResponses(obj: unknown): obj is Record<string, 1 | 2 | 3> {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  for (const key of REQUIRED_KEYS) {
    const val = o[key];
    if (val !== 1 && val !== 2 && val !== 3) return false;
  }
  return true;
}

/** Normalise responses so every dimension is 1|2|3 (clamp invalid values). */
export function normaliseSurveyResponses(obj: Record<string, unknown>): Record<string, 1 | 2 | 3> {
  const out: Record<string, 1 | 2 | 3> = {};
  for (const key of REQUIRED_KEYS) {
    const val = obj[key];
    out[key] = clamp3(typeof val === 'number' ? val : 2);
  }
  return out;
}

