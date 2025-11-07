'use client';

import { SCORE_COLORS, getScoreStatus, scoreToPercent } from './scoreTheme';

const QUESTION_COPY = [
  { key: 'sentiment', label: 'Q1', description: 'How are you feeling about work this week?' },
  { key: 'clarity', label: 'Q2', description: 'How clear are you about your priorities?' },
  { key: 'workload', label: 'Q3', description: 'How manageable is your current workload?' },
  { key: 'safety', label: 'Q4', description: 'How comfortable do you feel speaking up?' },
  { key: 'leadership', label: 'Q5', description: 'How supported do you feel by your immediate leadership?' },
] as const;

type QuestionScores = Record<'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership', number | undefined>;

type GroupLeaderCardProps = {
  teamName: string;
  wellbeingPercent?: number;
  questionScores: QuestionScores;
  historicalPoints: number[];
};

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length === 0) {
    return <div className="text-xs text-muted-foreground">No trend data yet</div>;
  }

  const padding = 6;
  const width = 180;
  const height = 70;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const path = points
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <path d={`M${padding},${height - padding} L${width - padding},${height - padding}`} stroke="#E2E8F0" strokeWidth={1.5} fill="none" />
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function MiniGauge({ value }: { value: number }) {
  const percent = Math.max(0, Math.min(100, value));
  const radius = 50;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const status = getScoreStatus(percent);
  
  return (
    <div className="relative w-32 h-20 flex flex-col items-center">
      <svg className="w-full h-full" viewBox="0 0 120 70">
        {/* Background arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={status.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute top-8 text-center">
        <div className="text-2xl font-bold" style={{ color: status.color }}>
          {Math.round(percent)}%
        </div>
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Wellbeing</div>
      </div>
    </div>
  );
}

function generateTeamInsight(wellbeingPercent: number, historicalPoints: number[], questionScores: QuestionScores): string {
  const status = getScoreStatus(wellbeingPercent);
  const trend = historicalPoints.length >= 2 
    ? historicalPoints[historicalPoints.length - 1] - historicalPoints[historicalPoints.length - 2]
    : 0;
  
  // Find lowest scoring dimension
  const scores = [
    { key: 'sentiment', value: scoreToPercent(questionScores.sentiment, 'five') ?? 0, name: 'Sentiment' },
    { key: 'clarity', value: scoreToPercent(questionScores.clarity, 'five') ?? 0, name: 'Role Clarity' },
    { key: 'workload', value: scoreToPercent(questionScores.workload, 'five') ?? 0, name: 'Workload' },
    { key: 'safety', value: scoreToPercent(questionScores.safety, 'five') ?? 0, name: 'Psychological Safety' },
    { key: 'leadership', value: scoreToPercent(questionScores.leadership, 'five') ?? 0, name: 'Leadership Support' },
  ].sort((a, b) => a.value - b.value);
  
  const lowest = scores[0];
  const highest = scores[scores.length - 1];
  
  if (wellbeingPercent < 40) {
    return `Critical: ${status.label}. Immediate attention needed. Focus on ${lowest.name} (${Math.round(lowest.value)}%) - schedule 1-on-1s to understand root causes.`;
  } else if (wellbeingPercent < 70) {
    if (trend < -5) {
      return `Declining trend detected. ${lowest.name} is the weakest area at ${Math.round(lowest.value)}%. Consider team check-in to address concerns before they escalate.`;
    } else if (trend > 5) {
      return `Improving! Keep momentum by maintaining focus on ${highest.name} (${Math.round(highest.value)}%) while addressing ${lowest.name} (${Math.round(lowest.value)}%).`;
    } else {
      return `Moderate wellbeing. ${lowest.name} (${Math.round(lowest.value)}%) needs attention. Consider targeted interventions or process improvements.`;
    }
  } else {
    if (trend > 0) {
      return `Thriving team! Wellbeing is strong and improving. Document what's working well to replicate across other teams. Monitor ${lowest.name} to maintain balance.`;
    } else {
      return `Strong performance. Team is thriving with ${highest.name} at ${Math.round(highest.value)}%. Continue current practices and watch for early warning signs.`;
    }
  }
}

export function GroupLeaderCard({ teamName, wellbeingPercent, questionScores, historicalPoints }: GroupLeaderCardProps) {
  const wellbeingStatus = getScoreStatus(wellbeingPercent ?? 0);
  const insight = generateTeamInsight(wellbeingPercent ?? 0, historicalPoints, questionScores);

  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-[var(--text-primary)]">{teamName}</div>
        <MiniGauge value={wellbeingPercent ?? 0} />
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Current Sentiment</h3>
        <div className="space-y-3">
          {QUESTION_COPY.map(({ key, label, description }) => {
            const value = questionScores[key];
            const hasValue = value !== undefined && value !== null;
            const percent = hasValue ? scoreToPercent(value, 'five') ?? 0 : 0;
            const status = getScoreStatus(hasValue ? percent : undefined);

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-white" style={{ backgroundColor: status.color }}>
                      {label}
                    </span>
                    <span className="font-medium text-[var(--text-muted)]">{description}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: status.color, transition: 'width 0.3s ease' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Historical Wellbeing Score</div>
        <Sparkline points={historicalPoints} color={wellbeingStatus.color ?? SCORE_COLORS.thriving} />
      </div>

      <div className="rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFF] px-4 py-3 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-primary)]">💡 AI Insight:</span> {insight}
      </div>
    </div>
  );
}


