'use client';

import { ScoreGaugeV2 } from '@/components/dashboard/ScoreGaugeV2';
import { DomainBarsV2, type DomainScores } from '@/components/dashboard/DomainBarsV2';

export type DashboardV2Data = {
  overallScore: number;
  domainScores: DomainScores;
};

export function DashboardDesignV2Client({ data }: { data: DashboardV2Data }) {
  return (
    <div
      className="rounded-xl p-8 max-w-2xl mx-auto"
      style={{ background: '#0f1e28' }}
    >
      <div className="grid gap-10 md:grid-cols-[auto_1fr] items-start">
        <div className="flex justify-center md:justify-start">
          <ScoreGaugeV2 score={data.overallScore} animate />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">
            Domain scores
          </h2>
          <DomainBarsV2 scores={data.domainScores} />
        </div>
      </div>
    </div>
  );
}
