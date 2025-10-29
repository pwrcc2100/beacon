'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

interface DemoResponse {
  id: string;
  employee_id: string;
  sentiment_3: number;
  clarity_3: number;
  workload_3: number;
  safety_3: number;
  leadership_3: number;
  created_at: string;
}

interface DashboardData {
  totalResponses: number;
  avgSentiment: number;
  avgClarity: number;
  avgWorkload: number;
  avgSafety: number;
  avgLeadership: number;
  overallWellbeingScore: number;
  responses: DemoResponse[];
}

export default function DemoDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/demo-responses');
      if (response.ok) {
        const apiData = await response.json();
        const responses = apiData.responses || [];
        
        if (responses.length > 0) {
          // Calculate averages
          const avgSentiment = responses.reduce((sum: number, r: DemoResponse) => sum + r.sentiment_3, 0) / responses.length;
          const avgClarity = responses.reduce((sum: number, r: DemoResponse) => sum + r.clarity_3, 0) / responses.length;
          const avgWorkload = responses.reduce((sum: number, r: DemoResponse) => sum + r.workload_3, 0) / responses.length;
          const avgSafety = responses.reduce((sum: number, r: DemoResponse) => sum + r.safety_3, 0) / responses.length;
          const avgLeadership = responses.reduce((sum: number, r: DemoResponse) => sum + r.leadership_3, 0) / responses.length;
          
          // Calculate overall wellbeing score (inverted scale: 1=good, 3=needs attention)
          const overallWellbeingScore = Math.round(((3 - avgSentiment) + (3 - avgClarity) + (3 - avgWorkload) + (3 - avgSafety) + (3 - avgLeadership)) / 5 * 100);
          
          setData({
            totalResponses: responses.length,
            avgSentiment,
            avgClarity,
            avgWorkload,
            avgSafety,
            avgLeadership,
            overallWellbeingScore,
            responses
          });
        } else {
          setData({
            totalResponses: 0,
            avgSentiment: 0,
            avgClarity: 0,
            avgWorkload: 0,
            avgSafety: 0,
            avgLeadership: 0,
            overallWellbeingScore: 0,
            responses: []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 70) return { color: '#64afac', icon: 'sentiment_satisfied' }; // Teal
    if (score >= 40) return { color: '#5d89a9', icon: 'sentiment_neutral' }; // Slate
    return { color: '#ea9999', icon: 'sentiment_dissatisfied' }; // Coral
  };

  const getDimensionStatus = (avg: number) => {
    if (avg <= 1.5) return { text: 'Good', color: '#64afac', icon: 'check_circle' };
    if (avg <= 2.5) return { text: 'Okay', color: '#5d89a9', icon: 'info' };
    return { text: 'Needs Attention', color: '#ea9999', icon: 'warning' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Thriving';
    if (score >= 40) return 'Managing OK';
    return 'Need Support';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Loading dashboard...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beacon Wellbeing Dashboard</h1>
          <p className="text-gray-600">Live demo data from survey responses</p>
        </div>

        {!data || data.totalResponses === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <MaterialIcon icon="quiz" style={{ fontSize: '64px', color: '#5d89a9', marginBottom: '16px' }} />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Responses Yet</h2>
            <p className="text-gray-600 mb-6">
              Complete the demo survey to see data appear here in real-time.
            </p>
            <a 
              href="/survey/test-demo" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MaterialIcon icon="quiz" style={{ fontSize: '20px' }} />
              Try Demo Survey
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#e0f2f1] to-white border-[#64afac]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#2B4162]">Total Responses</CardTitle>
                  <MaterialIcon icon="group" style={{ color: '#64afac' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2B4162]">{data.totalResponses}</div>
                  <p className="text-xs text-[#737A8C] mt-1">Demo participants</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#e8f0f5] to-white border-[#5d89a9]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#2B4162]">Overall Wellbeing</CardTitle>
                  <MaterialIcon icon={getStatusColor(data.overallWellbeingScore).icon} style={{ color: getStatusColor(data.overallWellbeingScore).color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2B4162]">{data.overallWellbeingScore}%</div>
                  <p className="text-xs text-[#737A8C] mt-1">{getScoreLabel(data.overallWellbeingScore)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#fbe9e7] to-white border-[#ea9999]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#2B4162]">Needs Attention</CardTitle>
                  <MaterialIcon icon="warning" style={{ color: '#ea9999' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2B4162]">
                    {data.responses.filter(r => {
                      const score = Math.round(((3 - r.sentiment_3) + (3 - r.clarity_3) + (3 - r.workload_3) + (3 - r.safety_3) + (3 - r.leadership_3)) / 5 * 100);
                      return score < 40;
                    }).length}
                  </div>
                  <p className="text-xs text-[#737A8C] mt-1">Require support</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#f4f4ee] to-white border-[#64afac]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#2B4162]">Thriving</CardTitle>
                  <MaterialIcon icon="sentiment_satisfied" style={{ color: '#64afac' }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#2B4162]">
                    {data.responses.filter(r => {
                      const score = Math.round(((3 - r.sentiment_3) + (3 - r.clarity_3) + (3 - r.workload_3) + (3 - r.safety_3) + (3 - r.leadership_3)) / 5 * 100);
                      return score >= 70;
                    }).length}
                  </div>
                  <p className="text-xs text-[#737A8C] mt-1">Doing well</p>
                </CardContent>
              </Card>
            </div>

            {/* Dimension Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2B4162]">Wellbeing Dimensions (1=Good, 3=Needs Attention)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { name: 'Sentiment', avg: data.avgSentiment, icon: 'mood' },
                    { name: 'Clarity', avg: data.avgClarity, icon: 'visibility' },
                    { name: 'Workload', avg: data.avgWorkload, icon: 'work' },
                    { name: 'Safety', avg: data.avgSafety, icon: 'security' },
                    { name: 'Leadership', avg: data.avgLeadership, icon: 'supervisor_account' }
                  ].map(({ name, avg, icon }) => {
                    const status = getDimensionStatus(avg);
                    return (
                      <div key={name} className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <MaterialIcon icon={icon} style={{ color: status.color, fontSize: '32px', marginRight: '12px' }} />
                        <div>
                          <div className="font-medium text-gray-800">{name}</div>
                          <div className="text-sm font-bold" style={{ color: status.color }}>
                            {avg.toFixed(1)} - {status.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Individual Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2B4162]">Individual Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                        <th className="py-3 px-4 border-b">Employee ID</th>
                        <th className="py-3 px-4 border-b">Submitted</th>
                        <th className="py-3 px-4 border-b">Sentiment</th>
                        <th className="py-3 px-4 border-b">Clarity</th>
                        <th className="py-3 px-4 border-b">Workload</th>
                        <th className="py-3 px-4 border-b">Safety</th>
                        <th className="py-3 px-4 border-b">Leadership</th>
                        <th className="py-3 px-4 border-b">Wellbeing Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.responses.map((response, index) => {
                        const wellbeingScore = Math.round(((3 - response.sentiment_3) + (3 - response.clarity_3) + (3 - response.workload_3) + (3 - response.safety_3) + (3 - response.leadership_3)) / 5 * 100);
                        const statusColor = getStatusColor(wellbeingScore);
                        return (
                          <tr key={response.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-800">Demo User {index + 1}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{new Date(response.created_at).toLocaleString()}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{response.sentiment_3}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{response.clarity_3}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{response.workload_3}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{response.safety_3}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">{response.leadership_3}</td>
                            <td className="py-3 px-4 text-sm font-semibold" style={{ color: statusColor.color }}>
                              {wellbeingScore}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
