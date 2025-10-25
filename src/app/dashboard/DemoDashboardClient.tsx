'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { MoodDistribution } from '@/components/dashboard/MoodDistribution';
import { TeamStatus } from '@/components/dashboard/TeamStatus';

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

export default function DemoDashboardClient() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Loading demo data...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!data || data.totalResponses === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <MaterialIcon icon="quiz" style={{ fontSize: '64px', color: '#5d89a9', marginBottom: '16px' }} />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo Mode</h2>
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
    );
  }

  // Transform demo data to match the expected format for existing components
  const transformedData = {
    totalResponses: data.totalResponses,
    avgSentiment: data.avgSentiment,
    avgClarity: data.avgClarity,
    avgWorkload: data.avgWorkload,
    avgSafety: data.avgSafety,
    avgLeadership: data.avgLeadership,
    overallWellbeingScore: data.overallWellbeingScore,
    responses: data.responses.map((r, index) => ({
      ...r,
      employee_id: `Demo User ${index + 1}`,
      wellbeing_score: Math.round(((3 - r.sentiment_3) + (3 - r.clarity_3) + (3 - r.workload_3) + (3 - r.safety_3) + (3 - r.leadership_3)) / 5 * 100)
    }))
  };

  return (
    <div className="space-y-8">
      {/* Demo Data Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <MaterialIcon icon="info" style={{ color: '#5d89a9', fontSize: '24px' }} />
          <div>
            <h3 className="font-semibold text-blue-900">Demo Mode Active</h3>
            <p className="text-sm text-blue-700">
              Showing live data from {data.totalResponses} demo survey responses. 
              <a href="/survey/test-demo" className="underline ml-1">Complete survey</a> to add more data.
            </p>
          </div>
        </div>
      </div>

      {/* Use existing dashboard components with demo data */}
      <StatusCards data={transformedData} />
      <MoodDistribution data={transformedData} />
      <TeamStatus data={transformedData} />
    </div>
  );
}
