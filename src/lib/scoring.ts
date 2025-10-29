// src/lib/scoring.ts
export const map3to5 = (v: 1 | 2 | 3): 1 | 3 | 5 => {
  if (v === 1) return 5;
  if (v === 2) return 3;
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

