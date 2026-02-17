export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function MethodologyPage() {
  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Overview</a>
      <a href="/analytics" className="block px-3 py-2 rounded hover:bg-black/5">Advanced Analytics</a>
      <a href="/methodology" className="block px-3 py-2 rounded bg-black/5 font-medium">Methodology</a>
      <a href="/dashboard?tab=export" className="block px-3 py-2 rounded hover:bg-black/5">Export</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="text-3xl">🟦</span>
            Beacon Psychosocial Safety Index – Methodology Overview
          </h1>
        </div>

        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle>Purpose</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed text-slate-700">
              The Beacon Check-In measures an organisation’s <strong>psychosocial safety climate</strong> — the extent to which its culture, systems, and leadership create a safe and supportive working environment.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 mt-3">
              It focuses on organisational conditions, not individual mental health, and aligns with the <strong>Australian COPSOQ-III validation (Rahimi et al., 2025)</strong>, <strong>Safe Work Australia’s Model Code of Practice – Managing Psychosocial Hazards (2022)</strong>, and <strong>ISO 45003:2021 Psychosocial Health & Safety at Work</strong>.
            </p>
            <p className="text-sm leading-relaxed text-slate-700 mt-3">
              Beacon transforms these standards into a practical, early-warning tool for Australian workplaces — especially construction, where project pressures, leadership style, and workload variation are high-risk psychosocial factors.
            </p>
          </CardContent>
        </Card>

        {/* Domains Measured */}
        <Card>
          <CardHeader>
            <CardTitle>Domains Measured</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 mb-4">
              Each domain reflects a <em>system-level condition</em> that supports or undermines wellbeing and psychological safety.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-3 px-3 font-semibold">Domain</th>
                    <th className="text-left py-3 px-3 font-semibold">Weight</th>
                    <th className="text-left py-3 px-3 font-semibold">Rationale</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Experience (Overall Sentiment)</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">25%</td>
                    <td className="py-3 px-3">Most sensitive to weekly changes; earliest risk signal. Example indicator: “How are you feeling about work this week?”</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Workload & Resourcing</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">25%</td>
                    <td className="py-3 px-3">Directly correlates with fatigue, stress, and claims. Example indicator: “How manageable is your current workload?”</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Psychological Safety</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">20%</td>
                    <td className="py-3 px-3">Central cultural driver; less volatile but crucial. Example indicator: “How comfortable do you feel raising concerns when something isn’t right?”</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Leadership & Support</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">20%</td>
                    <td className="py-3 px-3">Leader support buffers stress, improves wellbeing and drives safety participation. Poor support amplifies other risk factors (Gilbreath &amp; Benson, 2004; ISO 45003).</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Clarity & Direction</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">10%</td>
                    <td className="py-3 px-3">Important baseline, but stable week-to-week; ideal as contextual factor. Example indicator: “How clear are you on your priorities and what’s expected of you?”</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Beacon’s weighting model prioritises domains that change quickly and signal emerging risk. Experience and Workload are the most dynamic predictors of psychosocial strain, while Clarity serves as a structural anchor that changes more slowly. This ensures the Beacon Index remains both sensitive and stable.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              These weightings apply to the live Beacon Index calculation used in dashboards and analytics.
            </p>
            <p className="text-sm text-slate-700 mt-3">
              These five questions meet all Beacon’s functional, regulatory, and UX criteria while providing the strongest early-warning signal and the cleanest path to meaningful intervention.
            </p>
          </CardContent>
        </Card>

        {/* Scoring Method */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700">
              Responses use a <strong>3-point behavioural scale</strong> (Positive = 3, Neutral = 2, Negative = 1).
              Scores are normalised to a 0–100 scale where 100 = strong psychosocial safety climate.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="font-semibold text-slate-900">Beacon Index Formula</div>
              <div className="font-mono text-base bg-white p-4 rounded border border-slate-300 text-center">
                Beacon Index (%) = (0.25E + 0.25W + 0.20P + 0.20L + 0.10C)
              </div>
              <div className="text-xs text-slate-600">
                where E = Experience (overall sentiment), W = Workload, P = Psychological Safety, L = Leadership & Support, C = Clarity & Direction
              </div>
              <div className="text-xs text-slate-600">
                Weights are based on observed volatility and predictive correlation with psychosocial risk indicators (v1.1 operational model).
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card>
          <CardHeader>
            <CardTitle>Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-3 px-3 font-semibold">Beacon Index %</th>
                    <th className="text-left py-3 px-3 font-semibold">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-200 bg-green-50">
                    <td className="py-3 px-3 font-bold text-green-800">≥ 80</td>
                    <td className="py-3 px-3">Low psychosocial risk</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-blue-50">
                    <td className="py-3 px-3 font-bold text-blue-800">70–79</td>
                    <td className="py-3 px-3">Within tolerance</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-yellow-50">
                    <td className="py-3 px-3 font-bold text-yellow-800">60–69</td>
                    <td className="py-3 px-3">Emerging risk</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="py-3 px-3 font-bold text-red-800">&lt;60</td>
                    <td className="py-3 px-3">Elevated risk</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-700 mt-4">
              Risk bands are calibrated using weighted composite domain modelling and stability analysis across reporting cycles. Organisations may adjust tolerance bands in line with risk appetite and operating context.
            </p>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-3 list-disc list-inside text-slate-700">
              <li>
                Results represent <strong>organisational culture and practices</strong>, not personal wellbeing.
              </li>
              <li>
                The Index provides documented evidence of consultation and continuous improvement under WHS legislation.
              </li>
              <li>
                Supports compliance with <strong>ISO 45003:2021</strong> and Safe Work NSW psychosocial safety requirements.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Research Alignment */}
        <Card>
          <CardHeader>
            <CardTitle>Research & Regulatory Alignment</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-semibold text-blue-900 mb-1">COPSOQ-III</div>
                <div className="text-blue-800">Copenhagen Psychosocial Questionnaire – Australian validation (Rahimi et al., 2025)</div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-semibold text-blue-900 mb-1">Safe Work Australia</div>
                <div className="text-blue-800">Model Code of Practice – Managing Psychosocial Hazards (2022)</div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-semibold text-blue-900 mb-1">ISO 45003:2021</div>
                <div className="text-blue-800">Occupational health and safety management — Psychological health and safety at work</div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="font-semibold text-blue-900 mb-1">WHS Regulations</div>
                <div className="text-blue-800">Workplace Health & Safety regulatory expectations for psychosocial risk management</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Weighting (v1.1) */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Weighting Model (v1.1 Operational)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-amber-900">
            <p>
              The live Beacon Index uses the operational weighting shown above. It is intentionally balanced to act as an early-warning system: rapidly changing domains (Sentiment, Workload) carry the most weight, while Clarity provides structural context.
            </p>
            <p className="text-xs italic text-amber-800">
              These weights are reviewed as new volatility data and predictive correlations emerge. Organisations can optionally tailor weights to reflect their own risk profile once a baseline is established.
            </p>
          </CardContent>
        </Card>

        {/* Academic Research Foundation */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Research Foundation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-700">
              Beacon's methodology is informed by decades of validated research on workplace wellbeing, 
              psychological safety, and organisational effectiveness:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-semibold text-slate-900">Amy Edmondson (Harvard)</div>
                    <div className="text-sm text-slate-700 mt-1">
                      Pioneering research on psychological safety in teams and organisations. 
                      Her work demonstrates that psychological safety is the foundation for 
                      learning, innovation, and performance.
                    </div>
                    <div className="text-xs text-slate-600 mt-2 italic">
                      Key work: "The Fearless Organization" (2019)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-semibold text-slate-900">Karasek & Theorell</div>
                    <div className="text-sm text-slate-700 mt-1">
                      Job Demand-Control-Support Model - foundational framework showing that 
                      high demands combined with low control and support predict stress, 
                      burnout, and health outcomes.
                    </div>
                    <div className="text-xs text-slate-600 mt-2 italic">
                      Key work: "Healthy Work" (1990)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-semibold text-slate-900">Christina Maslach</div>
                    <div className="text-sm text-slate-700 mt-1">
                      Leading researcher on burnout and workplace wellbeing. Developed the 
                      Maslach Burnout Inventory and identified key organisational factors 
                      that prevent or contribute to burnout.
                    </div>
                    <div className="text-xs text-slate-600 mt-2 italic">
                      Key work: "The Truth About Burnout" (1997)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="font-semibold text-slate-900">Google's Project Aristotle</div>
                    <div className="text-sm text-slate-700 mt-1">
                      Large-scale study of team effectiveness at Google, identifying 
                      psychological safety as the most important factor in high-performing 
                      teams - more than talent, resources, or structure.
                    </div>
                    <div className="text-xs text-slate-600 mt-2 italic">
                      Published: 2015-2016
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-900">
                <strong>Why This Matters:</strong> Beacon doesn't measure individual mental health or resilience. 
                Instead, it assesses the <em>organisational conditions</em> that research shows predict wellbeing, 
                performance, and retention - exactly what Australian WHS regulations now require.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
