'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

type Props = {
  sentiment?: number;
  workload?: number;
  safety?: number;
  clarity?: number;
};

export function StatusCards({ sentiment, workload, safety, clarity }: Props) {
  const getStatus = (value?: number) => {
    if (!value) return { label: '—', color: '#737A8C', icon: 'help' }; // Beacon text-muted
    const percent = value * 20;
    if (percent >= 70) return { label: 'Yes', color: '#64afac', icon: 'sentiment_satisfied' }; // Beacon teal
    if (percent >= 50) return { label: 'Mixed', color: '#5d89a9', icon: 'sentiment_neutral' }; // Beacon slate
    return { label: 'No', color: '#ea9999', icon: 'sentiment_dissatisfied' }; // Beacon coral
  };

  const sentimentStatus = getStatus(sentiment);
  const workloadStatus = getStatus(workload);
  const safetyStatus = getStatus(safety);
  const clarityStatus = getStatus(clarity);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2 h-16 flex items-center">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            How are people feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-2">
            <MaterialIcon icon={sentimentStatus.icon} style={{ fontSize: '48px', color: sentimentStatus.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: sentimentStatus.color }}>
                {sentimentStatus.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average mood score: {sentiment ? (sentiment * 20).toFixed(0) : '—'}/100
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${sentiment ? sentiment * 20 : 0}%`,
                backgroundColor: sentimentStatus.color
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 h-16 flex items-center">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Is workload manageable?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-2">
            <MaterialIcon icon="work_history" style={{ fontSize: '48px', color: workloadStatus.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: workloadStatus.color }}>
                {workloadStatus.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average workload score: {workload ? (workload * 20).toFixed(0) : '—'}/100
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${workload ? workload * 20 : 0}%`,
                backgroundColor: workloadStatus.color
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 h-16 flex items-center">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Do people feel supported?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-2">
            <MaterialIcon icon="diversity_3" style={{ fontSize: '48px', color: safetyStatus.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: safetyStatus.color }}>
                {safetyStatus.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average support score: {safety ? (safety * 20).toFixed(0) : '—'}/100
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${safety ? safety * 20 : 0}%`,
                backgroundColor: safetyStatus.color
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 h-16 flex items-center">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Do people feel valued?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-2">
            <MaterialIcon icon="grade" style={{ fontSize: '48px', color: clarityStatus.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: clarityStatus.color }}>
                {clarityStatus.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average valued score: {clarity ? (clarity * 20).toFixed(0) : '—'}/100
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${clarity ? clarity * 20 : 0}%`,
                backgroundColor: clarityStatus.color
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

