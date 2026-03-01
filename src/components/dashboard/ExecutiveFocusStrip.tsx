'use client';

import type {
  DomainPriorityItem,
  TeamPriorityItem,
  ParticipationConfidenceResult,
  EscalationResult,
} from '@/lib/executiveLogic';

export type ExecutiveFocusStripProps = {
  primaryDomain: DomainPriorityItem | null;
  teamsByPriority: TeamPriorityItem[];
  participation: ParticipationConfidenceResult;
  escalation: EscalationResult;
};

export function ExecutiveFocusStrip({
  primaryDomain,
  teamsByPriority,
  participation,
  escalation,
}: ExecutiveFocusStripProps) {
  const topTeams = teamsByPriority.slice(0, 3);
  const escalationReasonsShow = escalation.reasons.slice(0, 2);
  const escalationReasonsTooltip = escalation.reasons.slice(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Primary Focus Domain — largest */}
      <div className="md:col-span-2 rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-5 shadow-bi-sm">
        <p className="text-xs text-bi-textMuted uppercase tracking-wider mb-2">Primary focus</p>
        {primaryDomain ? (
          <>
            <p className="text-lg font-semibold text-bi-text">{primaryDomain.label}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-2xl font-bold tabular-nums text-bi-text">
                {Math.round(primaryDomain.score100)}
              </span>
              {primaryDomain.delta !== 0 && (
                <span
                  className={`text-sm font-medium tabular-nums ${
                    primaryDomain.delta > 0 ? 'text-bi-success' : 'text-bi-danger'
                  }`}
                >
                  {primaryDomain.delta > 0 ? '+' : ''}{primaryDomain.delta}
                </span>
              )}
            </div>
            <p className="text-sm text-bi-textMuted mt-1">{primaryDomain.whyShort}</p>
          </>
        ) : (
          <p className="text-sm text-bi-textMuted">No domain below tolerance</p>
        )}
      </div>

      {/* Teams requiring attention */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
        <p className="text-xs text-bi-textMuted uppercase tracking-wider mb-2">Teams to watch</p>
        <p className="text-2xl font-bold tabular-nums text-bi-text">{teamsByPriority.length}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {topTeams.map((t) => (
            <span
              key={t.teamId}
              className="inline-flex items-center gap-1 rounded-full bg-bi-surfaceAlt px-2 py-0.5 text-xs font-medium text-bi-text truncate max-w-[140px]"
              title={t.teamName}
            >
              <span className="truncate">{t.teamName}</span>
              <span className="tabular-nums text-bi-textMuted shrink-0">{Math.round(t.score)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Participation confidence */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
        <p className="text-xs text-bi-textMuted uppercase tracking-wider mb-2">Participation</p>
        <p className="text-sm font-semibold text-bi-text">{participation.label}</p>
        <div className="mt-2 h-2 rounded-full bg-bi-surfaceAlt overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${participation.rate}%`,
              backgroundColor:
                participation.level === 'high'
                  ? 'var(--bi-success)'
                  : participation.level === 'moderate'
                    ? 'var(--bi-warning)'
                    : 'var(--bi-danger)',
            }}
          />
        </div>
        <p className="text-xs text-bi-textMuted mt-1">{Math.round(participation.rate)}%</p>
        {participation.caution && (
          <p className="text-xs text-bi-textMuted mt-1">{participation.caution}</p>
        )}
      </div>

      {/* Escalation */}
      <div className="rounded-bi-lg bg-bi-surfaceCard border border-bi-borderSubtle p-4 shadow-bi-sm">
        <p className="text-xs text-bi-textMuted uppercase tracking-wider mb-2">Escalation signal</p>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            escalation.level === 'High'
              ? 'bg-bi-danger/20 text-bi-danger'
              : escalation.level === 'Moderate'
                ? 'bg-bi-warning/20 text-bi-warning'
                : 'bg-bi-surfaceAlt text-bi-textMuted'
          }`}
        >
          {escalation.level}
        </span>
        <div className="mt-2 h-1.5 rounded-full bg-bi-surfaceAlt overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${escalation.score}%`,
              backgroundColor:
                escalation.level === 'High'
                  ? 'var(--bi-danger)'
                  : escalation.level === 'Moderate'
                    ? 'var(--bi-warning)'
                    : 'var(--bi-border-subtle)',
            }}
          />
        </div>
        {escalationReasonsShow.length > 0 && (
          <ul className="mt-2 text-xs text-bi-textMuted space-y-0.5">
            {escalationReasonsShow.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
        {escalationReasonsTooltip.length > 0 && (
          <p
            className="text-xs text-bi-textSubtle mt-1"
            title={escalationReasonsTooltip.join('. ')}
          >
            +{escalationReasonsTooltip.length} more
          </p>
        )}
      </div>
    </div>
  );
}
