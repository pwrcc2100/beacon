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
            <p className="text-sm leading-relaxed">
              The Beacon Check-in measures an organisation's <strong>psychosocial safety climate</strong> — the extent to which its culture, systems and leadership create a safe and supportive working environment.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              It focuses on organisational factors, not individual mental health, aligning with the <strong>Australian COPSOQ-III validation (Rahimi et al., 2025)</strong> and <strong>Safe Work Australia's Model Code of Practice – Managing Psychosocial Hazards (2022)</strong>.
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
              Each domain reflects a <em>system-level condition</em> that supports or undermines psychological safety.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left py-3 px-3 font-semibold">Domain</th>
                    <th className="text-left py-3 px-3 font-semibold">What it Represents</th>
                    <th className="text-left py-3 px-3 font-semibold">Example Indicator</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Clarity & Direction</td>
                    <td className="py-3 px-3">Clear expectations, communication and role definition</td>
                    <td className="py-3 px-3 italic text-slate-600">"I understand what's expected of me."</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Workload & Resourcing</td>
                    <td className="py-3 px-3">Balance between job demands and available resources</td>
                    <td className="py-3 px-3 italic text-slate-600">"My workload is reasonable for the time available."</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Psychological Safety (Voice)</td>
                    <td className="py-3 px-3">Trust and confidence to speak up or raise issues</td>
                    <td className="py-3 px-3 italic text-slate-600">"It's safe to express a concern at work."</td>
                  </tr>
                  <tr className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Leadership & Support</td>
                    <td className="py-3 px-3">Management commitment to wellbeing and follow-through on concerns</td>
                    <td className="py-3 px-3 italic text-slate-600">"Leaders act on issues raised by staff."</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium">Fairness & Recognition</td>
                    <td className="py-3 px-3">Procedural fairness and acknowledgement of contributions</td>
                    <td className="py-3 px-3 italic text-slate-600">"People are treated fairly and good work is recognised."</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              Values are normalised to a 0-100 scale where 100 = strong organisational safety climate.
              All domains are equally weighted in version 1.0 to ensure transparency and simplicity.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="font-semibold mb-2 text-slate-900">Beacon Index Formula</div>
              <div className="font-mono text-base bg-white p-4 rounded border border-slate-300 text-center">
                Beacon Index (%) = (C + W + P + L + F) / 5
              </div>
              <div className="text-xs text-slate-600 mt-3">
                where C = Clarity, W = Workload, P = Psychological Safety, L = Leadership, F = Fairness
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
                    <td className="py-3 px-3 font-bold text-green-800">≥ 80%</td>
                    <td className="py-3 px-3">Strong psychosocial safety climate</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-yellow-50">
                    <td className="py-3 px-3 font-bold text-yellow-800">65 – 79%</td>
                    <td className="py-3 px-3">Generally positive; monitor emerging risks</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="py-3 px-3 font-bold text-red-800">&lt; 65%</td>
                    <td className="py-3 px-3">Elevated psychosocial risk; review workload, leadership, or systems</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                Future versions will incorporate empirically-derived weightings validated against outcomes such as engagement, turnover and safety events.
              </li>
              <li>
                The Index supports compliance with <strong>ISO 45003:2021</strong> and WHS regulatory expectations for psychosocial risk management.
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

        {/* Current Dashboard Implementation Note */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Current Dashboard Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-900">
              The current dashboard uses a weighted model that emphasizes immediate risk indicators for early warning:
            </p>
            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-amber-900">
                <div><strong>Sentiment (Overall):</strong> 25%</div>
                <div className="text-amber-700">Captures wellbeing at a glance</div>
                <div><strong>Workload (Capacity):</strong> 25%</div>
                <div className="text-amber-700">Strong predictor of stress & risk</div>
                <div><strong>Psychological Safety:</strong> 20%</div>
                <div className="text-amber-700">Key cultural indicator</div>
                <div><strong>Leadership Support:</strong> 20%</div>
                <div className="text-amber-700">Directly impacts all others</div>
                <div><strong>Clarity (Direction):</strong> 10%</div>
                <div className="text-amber-700">Important but less volatile week-to-week</div>
              </div>
            </div>
            <p className="text-xs text-amber-800 italic mt-3">
              This model prioritizes early warning indicators while maintaining focus on systemic factors. Organizations may adjust weights based on their specific risk profile and maturity. Future versions will align with the equal-weighted Beacon Index as the evidence base grows.
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
