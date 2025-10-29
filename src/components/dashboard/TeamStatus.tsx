'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

type Props = {
  responses: Array<{
    sentiment_5: number;
    workload_5: number;
    safety_5: number;
    leadership_5: number;
    clarity_5: number;
  }>;
};

export function TeamStatus({ responses }: Props) {
  // Calculate overall wellbeing score for each response
  const categorized = responses.map(r => {
    const score = ((r.sentiment_5 * 0.25) + (r.workload_5 * 0.25) + (r.safety_5 * 0.20) + (r.leadership_5 * 0.20) + (r.clarity_5 * 0.10)) * 20;
    return score;
  });

  const thriving = categorized.filter(s => s >= 70).length;
  const managingOk = categorized.filter(s => s >= 50 && s < 70).length;
  const needSupport = categorized.filter(s => s < 50).length;
  const total = responses.length || 1;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Overall Team Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-3 gap-4">
          {/* Thriving */}
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: '#f4f4ee' }}
          >
            <MaterialIcon icon="star" style={{ fontSize: '56px', color: '#64afac', marginBottom: '8px' }} />
            <div className="text-sm font-semibold mb-1" style={{ color: '#2E2E38' }}>Thriving</div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#64afac' }}>{thriving}</div>
            <div className="text-xs" style={{ color: '#737A8C' }}>{Math.round((thriving / total) * 100)}% of team</div>
          </div>

          {/* Managing OK */}
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: '#eeefec' }}
          >
            <MaterialIcon icon="thumbs_up_down" style={{ fontSize: '56px', color: '#5d89a9', marginBottom: '8px' }} />
            <div className="text-sm font-semibold mb-1" style={{ color: '#2E2E38' }}>Managing OK</div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#5d89a9' }}>{managingOk}</div>
            <div className="text-xs" style={{ color: '#737A8C' }}>{Math.round((managingOk / total) * 100)}% of team</div>
          </div>

          {/* Need Support */}
          <div 
            className="text-center p-6 rounded-lg"
            style={{ backgroundColor: '#f6f2ef' }}
          >
            <MaterialIcon icon="warning" style={{ fontSize: '56px', color: '#ea9999', marginBottom: '8px' }} />
            <div className="text-sm font-semibold mb-1" style={{ color: '#2E2E38' }}>Need Support</div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#ea9999' }}>{needSupport}</div>
            <div className="text-xs" style={{ color: '#737A8C' }}>{Math.round((needSupport / total) * 100)}% of team</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

