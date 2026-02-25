'use client';

import { useState } from 'react';
import { map3to5 } from '@/lib/scoring';

type ScenarioStatus = 'pending' | 'running' | 'pass' | 'fail';

interface Scenario {
  id: string;
  name: string;
  description: string;
  payload: Record<string, unknown>;
}

function buildPayload(sentiment: 1 | 2 | 3, clarity: 1 | 2 | 3, workload: 1 | 2 | 3, safety: 1 | 2 | 3, leadership: 1 | 2 | 3, support = false) {
  return {
    token: 'test-checklist-demo',
    sentiment_3: sentiment,
    sentiment_5: map3to5(sentiment),
    clarity_3: clarity,
    clarity_5: map3to5(clarity),
    workload_3: workload,
    workload_5: map3to5(workload),
    safety_3: safety,
    safety_5: map3to5(safety),
    leadership_3: leadership,
    leadership_5: map3to5(leadership),
    support_requested: support,
    support_contacts: support ? ['HR Team'] : [],
    support_contact_method: support ? 'work_email' : undefined,
    support_contact_value: support ? 'test@example.com' : undefined,
    support_timeframe: support ? 'this_week' : undefined,
    support_other_details: undefined,
    high_risk_flag: sentiment === 3 || workload === 3 || safety === 3 || leadership === 3,
    risk_factors: [
      ...(workload === 3 ? ['workload'] : []),
      ...(safety === 3 ? ['safety'] : []),
      ...(leadership === 3 ? ['support'] : []),
      ...(sentiment === 3 ? ['overall'] : []),
    ],
    meta: { ui_version: 'test-checklist', channel: 'web' },
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'all-positive',
    name: 'All positive (1,1,1,1,1)',
    description: 'Every dimension best score — no support path.',
    payload: buildPayload(1, 1, 1, 1, 1),
  },
  {
    id: 'all-struggling',
    name: 'All struggling (3,3,3,3,3)',
    description: 'Every dimension worst score — high risk, support path.',
    payload: buildPayload(3, 3, 3, 3, 3, true),
  },
  {
    id: 'mixed',
    name: 'Mixed (1,2,3,2,1)',
    description: 'Varied responses — no support path (no 3 on workload/safety/leadership/sentiment).',
    payload: buildPayload(1, 2, 3, 2, 1),
  },
  {
    id: 'mixed-support-declined',
    name: 'Mixed + support declined',
    description: 'High risk payload with support_requested: false.',
    payload: buildPayload(3, 2, 2, 3, 2, false),
  },
  {
    id: 'all-mid',
    name: 'All middle (2,2,2,2,2)',
    description: 'All dimensions option 2.',
    payload: buildPayload(2, 2, 2, 2, 2),
  },
  {
    id: 'one-dimension-high-risk',
    name: 'Single high risk (1,1,3,1,1)',
    description: 'Only workload = 3 — triggers support path.',
    payload: buildPayload(1, 1, 3, 1, 1, true),
  },
];

export default function SurveyTestChecklistPage() {
  const [results, setResults] = useState<Record<string, { status: ScenarioStatus; ms?: number; error?: string }>>({});
  const [running, setRunning] = useState(false);

  const runOne = async (scenario: Scenario) => {
    setResults((r) => ({ ...r, [scenario.id]: { status: 'running' } }));
    const start = Date.now();
    try {
      const res = await fetch('/api/demo-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario.payload),
      });
      const ms = Date.now() - start;
      if (res.ok) {
        setResults((r) => ({ ...r, [scenario.id]: { status: 'pass', ms } }));
      } else {
        const text = await res.text();
        let err = `HTTP ${res.status}`;
        try {
          const j = JSON.parse(text);
          if (j.error) err = j.error;
          if (j.details) err += ': ' + j.details;
        } catch {
          if (text) err += ': ' + text.slice(0, 100);
        }
        setResults((r) => ({ ...r, [scenario.id]: { status: 'fail', ms, error: err } }));
      }
    } catch (e) {
      const ms = Date.now() - start;
      setResults((r) => ({
        ...r,
        [scenario.id]: { status: 'fail', ms, error: e instanceof Error ? e.message : 'Network error' },
      }));
    }
  };

  const runAll = async () => {
    setRunning(true);
    setResults({});
    for (const scenario of SCENARIOS) {
      await runOne(scenario);
    }
    setRunning(false);
  };

  const allDone = Object.keys(results).length === SCENARIOS.length;
  const passed = Object.values(results).filter((r) => r.status === 'pass').length;
  const failed = Object.values(results).filter((r) => r.status === 'fail').length;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Survey test checklist</h1>
          <p className="text-gray-600 mt-1">
            Run these scenarios in one go to verify every response variation submits successfully.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={runAll}
            disabled={running}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? 'Running…' : 'Run all scenarios'}
          </button>
          <a
            href="/survey/test-demo"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50"
          >
            Open live survey (manual test)
          </a>
          <a
            href="/demo-qr"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50"
          >
            Demo QR / token
          </a>
        </div>

        {allDone && (
          <div
            className={`mb-6 p-4 rounded-lg font-medium ${failed === 0 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
          >
            {failed === 0
              ? `All ${passed} scenarios passed.`
              : `${passed} passed, ${failed} failed.`}
          </div>
        )}

        <ul className="space-y-4">
          {SCENARIOS.map((scenario) => {
            const result = results[scenario.id];
            return (
              <li
                key={scenario.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">{scenario.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{scenario.description}</div>
                    {result?.status === 'fail' && result.error && (
                      <div className="text-sm text-red-600 mt-2">{result.error}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {result?.status === 'running' && (
                      <span className="text-blue-600 text-sm">Running…</span>
                    )}
                    {result?.status === 'pass' && (
                      <span className="text-green-600 font-medium">
                        Pass {result.ms != null && `(${result.ms}ms)`}
                      </span>
                    )}
                    {result?.status === 'fail' && (
                      <span className="text-red-600 font-medium">Fail</span>
                    )}
                    {(!result || result.status === 'pending') && !running && (
                      <button
                        onClick={() => runOne(scenario)}
                        className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                      >
                        Run
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
          <strong>Demo vs live:</strong> These runs POST to <code className="bg-gray-200 px-1 rounded">/api/demo-responses</code> (in-memory).
          For real token flow, use a link from <strong>Demo QR</strong> or your real survey link and add <code className="bg-gray-200 px-1 rounded">?log=1</code> to the URL to see submit payload and response in the browser console.
        </div>
      </div>
    </main>
  );
}
