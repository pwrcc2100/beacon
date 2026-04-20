'use client';

interface DomainScores {
  experience: number;
  workload: number;
  safety: number;
  leadership: number;
  clarity: number;
}

interface ExecutiveSummaryContentProps {
  domainScores: DomainScores;
}

interface DomainInsight {
  domain: string;
  systemSignal: string;
  organisationalConsequence: string;
  leadershipFocus: string;
  show: boolean;
}

export default function ExecutiveSummaryContent({ domainScores }: ExecutiveSummaryContentProps) {
  const { experience, workload, safety, leadership, clarity } = domainScores;

  // Generate insights for ALL domains - always show content for monthly reports
  const insights: DomainInsight[] = [];

  // Experience insights
  if (experience < 40) {
    insights.push({
      domain: 'Experience',
      systemSignal: `Experience is at a critically low level (${experience}), indicating sustained workforce strain across the system rather than isolated dissatisfaction.\n\nThis typically occurs when cumulative pressure from workload, leadership support or organisational clarity is exceeding recovery capacity.`,
      organisationalConsequence: `Sustained low experience levels are strongly associated with:\n• declining psychological safety\n• increased withdrawal behaviours (silence, disengagement)\n• reduced discretionary effort\n• higher attrition and burnout risk\n\nIf unaddressed, this pressure often spreads into psychological safety deterioration within 1–2 reporting cycles.`,
      leadershipFocus: `Leaders should prioritise structural pressure relief rather than morale initiatives.\n\nImmediate actions:\n• Identify the top 1–2 operational pressure points driving strain\n• Reduce unnecessary workload or conflicting priorities\n• Reinforce leadership visibility and support during high-pressure periods\n\nThe objective is to restore recovery capacity across teams.`,
      show: true,
    });
  } else if (experience >= 40 && experience < 60) {
    insights.push({
      domain: 'Experience',
      systemSignal: `Experience is at ${experience}, indicating emerging system strain.`,
      organisationalConsequence: `Sustained pressure may begin to reduce psychological safety and discretionary effort if not addressed.`,
      leadershipFocus: `Identify early operational pressures and intervene before escalation.`,
      show: true,
    });
  } else {
    insights.push({
      domain: 'Experience',
      systemSignal: `Experience is at ${experience}, indicating workforce conditions are within acceptable range.`,
      organisationalConsequence: `Current experience levels support psychological safety and discretionary effort across teams.`,
      leadershipFocus: `Maintain current operational conditions and continue monitoring for early pressure signals.`,
      show: true,
    });
  }

  // Psychological Safety insights
  if (safety < 60) {
    insights.push({
      domain: 'Psychological Safety',
      systemSignal: `Psychological safety has entered the elevated risk band (${safety}).\n\nThis suggests individuals may be withholding concerns, avoiding challenge or deferring decisions upward.`,
      organisationalConsequence: `Low psychological safety is often associated with:\n• reduced error reporting\n• slower problem detection\n• operational issues escalating before detection\n\nWhen combined with low Experience scores, it indicates pressure may be suppressing open communication.`,
      leadershipFocus: `Leaders should prioritise restoring interpersonal safety signals.\n\nRecommended actions:\n• explicitly invite challenge and dissent in decision forums\n• acknowledge mistakes or uncertainty at leadership level\n• reinforce that surfacing problems early is valued.`,
      show: true,
    });
  } else {
    insights.push({
      domain: 'Psychological Safety',
      systemSignal: `Psychological safety is at ${safety}, indicating a healthy interpersonal risk climate.`,
      organisationalConsequence: `Current safety levels support early problem detection and open communication across teams.`,
      leadershipFocus: `Continue reinforcing open communication signals and maintain leadership practices that support psychological safety.`,
      show: true,
    });
  }

  // Workload insights
  if (workload < 50) {
    insights.push({
      domain: 'Workload & Resourcing',
      systemSignal: `Workload & Resourcing is at ${workload}, indicating operational demand may be exceeding available capacity.`,
      organisationalConsequence: `Demand-capacity imbalance typically leads to:\n• fatigue accumulation\n• error risk\n• declining experience scores`,
      leadershipFocus: `Rebalance workload and available resources by removing non-essential tasks or adjusting timelines.`,
      show: true,
    });
  } else {
    insights.push({
      domain: 'Workload & Resourcing',
      systemSignal: `Workload & Resourcing is at ${workload}, indicating operational demand is aligned with available capacity.`,
      organisationalConsequence: `Current workload levels support sustainable operations and recovery capacity across teams.`,
      leadershipFocus: `Maintain current resource allocation and continue monitoring workload distribution for emerging pressure points.`,
      show: true,
    });
  }

  // Leadership insights
  if (leadership < 60) {
    insights.push({
      domain: 'Leadership & Support',
      systemSignal: `Leadership & Support is at ${leadership}, indicating leadership support capacity may be insufficient for current operating pressure.`,
      organisationalConsequence: `Low support amplifies workload stress and reduces psychological safety.`,
      leadershipFocus: `Increase leadership visibility, decision clarity and support availability.`,
      show: true,
    });
  } else {
    insights.push({
      domain: 'Leadership & Support',
      systemSignal: `Leadership & Support is at ${leadership}, indicating leadership support capacity is adequate for current operating conditions.`,
      organisationalConsequence: `Current leadership support levels help buffer workload stress and maintain psychological safety.`,
      leadershipFocus: `Continue maintaining leadership visibility and support availability, particularly during high-pressure periods.`,
      show: true,
    });
  }

  // Clarity insights
  if (clarity < 60) {
    insights.push({
      domain: 'Clarity & Direction',
      systemSignal: `Clarity & Direction is at ${clarity}, indicating role clarity or organisational alignment may be weakening.`,
      organisationalConsequence: `Low clarity creates:\n• duplicated work\n• decision delays\n• hidden workload pressure`,
      leadershipFocus: `Clarify priorities, decision ownership and organisational direction.`,
      show: true,
    });
  } else {
    insights.push({
      domain: 'Clarity & Direction',
      systemSignal: `Clarity & Direction is at ${clarity}, indicating strong role clarity and organisational alignment.`,
      organisationalConsequence: `Current clarity levels support efficient coordination and reduce hidden workload pressure.`,
      leadershipFocus: `Maintain clear communication of priorities, decision ownership and organisational direction.`,
      show: true,
    });
  }

  // Always show all insights for monthly reports
  const visibleInsights = insights.filter(i => i.show);

  return (
    <div className="executive-summary-content max-w-4xl mx-auto">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .executive-summary-content {
            max-width: 100%;
          }
          
          .domain-section {
            page-break-inside: avoid;
            margin-bottom: 2rem;
            border: 1px solid #e5e7eb !important;
          }
          
          .domain-section h2 {
            page-break-after: avoid;
          }
          
          .domain-section section {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {visibleInsights.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">
          <p className="text-lg">All domains are within acceptable ranges.</p>
          <p className="text-sm mt-2">No critical insights to report at this time.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {visibleInsights.map((insight, idx) => (
            <div key={idx} className="domain-section bg-white rounded-lg border border-black/10 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#2B4162] mb-6 pb-3 border-b-2 border-[#64afac]">
                {insight.domain}
              </h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-[#2B4162] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#64afac]"></span>
                    System Signal
                  </h3>
                  <div className="text-[#737A8C] leading-relaxed whitespace-pre-line">
                    {insight.systemSignal}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[#2B4162] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8b3a3a]"></span>
                    Organisational Consequence
                  </h3>
                  <div className="text-[#737A8C] leading-relaxed whitespace-pre-line">
                    {insight.organisationalConsequence}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-[#2B4162] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2d6785]"></span>
                    Leadership Focus
                  </h3>
                  <div className="text-[#737A8C] leading-relaxed whitespace-pre-line">
                    {insight.leadershipFocus}
                  </div>
                </section>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
