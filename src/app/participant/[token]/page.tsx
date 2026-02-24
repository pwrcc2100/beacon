import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { WellbeingGauge } from '@/components/charts/WellbeingGauge';

async function getParticipantData(token: string) {
  // First, get the response for this token
  const { data: response } = await supabaseAdmin
    .from('responses_v3')
    .select('*, employees(*)')
    .eq('token_id', token)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  if (!response) {
    return null;
  }

  return response;
}

function getScoreLabel(value: number): { label: string; color: string; emoji: string } {
  if (value >= 4) {
    return { label: 'Good', color: '#64afac', emoji: '✅' };
  } else if (value === 3) {
    return { label: 'Okay', color: '#5d89a9', emoji: '😐' };
  } else {
    return { label: 'Needs Attention', color: '#ea9999', emoji: '⚠️' };
  }
}

function getScore5(value: number): number {
  // Convert 3-point to 5-point scale
  if (value === 1) return 5;
  if (value === 2) return 3;
  return 1;
}

export default async function ParticipantPage({ params }: { params: { token: string } }) {
  const response = await getParticipantData(params.token);

  if (!response) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Survey Not Found</h2>
              <p className="text-muted-foreground mb-4">
                No response found for this token. Please complete the survey first.
              </p>
              <a href={`/survey/${params.token}`} className="text-primary hover:underline">
                Complete Survey →
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const sentiment5 = getScore5(response.sentiment_3);
  const clarity5 = getScore5(response.clarity_3);
  const workload5 = getScore5(response.workload_3);
  const safety5 = getScore5(response.safety_3);
  const leadership5 = getScore5(response.leadership_3);

  const overallScore = ((sentiment5 * 0.25) + (workload5 * 0.25) + (leadership5 * 0.20) + (safety5 * 0.20) + (clarity5 * 0.10)) * 20;

  const sentimentInfo = getScoreLabel(sentiment5);
  const clarityInfo = getScoreLabel(clarity5);
  const workloadInfo = getScoreLabel(workload5);
  const safetyInfo = getScoreLabel(safety5);
  const leadershipInfo = getScoreLabel(leadership5);

  const Sidebar = (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Navigation</div>
      <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-black/5">Dashboard</a>
      <a href="/demo-qr" className="block px-3 py-2 rounded hover:bg-black/5">QR Code Generator</a>
    </div>
  );

  return (
    <DashboardShell sidebar={Sidebar}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Your Response
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Submitted: {new Date(response.submitted_at || response.created_at).toLocaleString()}
          </p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle>Your Beacon Index Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <WellbeingGauge
                sentiment={sentiment5 / 5}
                clarity={clarity5 / 5}
                workload={workload5 / 5}
                leadership={leadership5 / 5}
                safety={safety5 / 5}
                prevScore={undefined}
              />
            </div>
            <div className="text-center mt-4">
              <div className="text-4xl font-bold mb-2" style={{ color: overallScore >= 70 ? '#64afac' : overallScore >= 50 ? '#5d89a9' : '#ea9999' }}>
                {overallScore.toFixed(0)}%
              </div>
              <p className="text-sm text-muted-foreground">
                {overallScore >= 70 ? 'Healthy' : overallScore >= 50 ? 'Moderate' : 'Needs Attention'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Individual Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experience / Overall Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{sentimentInfo.emoji}</div>
                  <div className="text-sm font-medium">{sentimentInfo.label}</div>
                </div>
                <Badge style={{ background: sentimentInfo.color, color: 'white' }}>
                  {(sentiment5 * 20).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "How are you feeling about work this week?"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workload & Resourcing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{workloadInfo.emoji}</div>
                  <div className="text-sm font-medium">{workloadInfo.label}</div>
                </div>
                <Badge style={{ background: workloadInfo.color, color: 'white' }}>
                  {(workload5 * 20).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "How manageable is your current workload?"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clarity & Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{clarityInfo.emoji}</div>
                  <div className="text-sm font-medium">{clarityInfo.label}</div>
                </div>
                <Badge style={{ background: clarityInfo.color, color: 'white' }}>
                  {(clarity5 * 20).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "How clear are you on your priorities and what’s expected of you?"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Psychological Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{safetyInfo.emoji}</div>
                  <div className="text-sm font-medium">{safetyInfo.label}</div>
                </div>
                <Badge style={{ background: safetyInfo.color, color: 'white' }}>
                  {(safety5 * 20).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "How comfortable do you feel raising concerns when something isn’t right?"
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Leadership & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{leadershipInfo.emoji}</div>
                  <div className="text-sm font-medium">{leadershipInfo.label}</div>
                </div>
                <Badge style={{ background: leadershipInfo.color, color: 'white' }}>
                  {(leadership5 * 20).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                "How supported do you feel by your immediate leadership?"
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support Request Info */}
        {response.support_requested && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Support Request Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                You requested support on: {new Date(response.submitted_at || response.created_at).toLocaleDateString()}
              </p>
              {response.support_contacts && (
                <p className="text-sm">
                  <strong>Selected contacts:</strong> {Array.isArray(response.support_contacts) ? response.support_contacts.join(', ') : response.support_contacts}
                </p>
              )}
              {response.support_timeframe && (
                <p className="text-sm">
                  <strong>Preferred timeframe:</strong> {response.support_timeframe}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Someone will reach out to you within your specified timeframe.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <a href="/dashboard" className="flex-1">
            <div className="px-4 py-3 bg-[var(--navy)] text-white rounded-lg text-center font-semibold hover:opacity-90 transition-opacity">
              View Dashboard
            </div>
          </a>
          <a href="/thanks" className="flex-1">
            <div className="px-4 py-3 border border-gray-300 rounded-lg text-center font-semibold hover:bg-gray-50 transition-colors">
              Back to Thank You
            </div>
          </a>
        </div>
      </div>
    </DashboardShell>
  );
}




