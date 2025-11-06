'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { formatPercent, getScoreStatus, scoreToPercent, ScoreCategory } from './scoreTheme';

type Props = {
  sentiment?: number;
  workload?: number;
  safety?: number;
  clarity?: number;
};

export function StatusCards({ sentiment, workload, safety, clarity }: Props) {
  const STATUS_ICONS: Record<ScoreCategory, string> = {
    thriving: 'sentiment_satisfied',
    watch: 'sentiment_neutral',
    alert: 'sentiment_dissatisfied',
    unknown: 'help',
  };

  const toMetric = (value?: number) => {
    const percent = scoreToPercent(value, 'five');
    const status = getScoreStatus(percent);
    const icon = STATUS_ICONS[status.category];
    return { percent, status, icon };
  };

  const sentimentMetric = toMetric(sentiment);
  const workloadMetric = toMetric(workload);
  const safetyMetric = toMetric(safety);
  const clarityMetric = toMetric(clarity);

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
            <MaterialIcon icon={sentimentMetric.icon} style={{ fontSize: '48px', color: sentimentMetric.status.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: sentimentMetric.status.color }}>
                {sentimentMetric.status.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average mood score: {formatPercent(sentimentMetric.percent)}
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${sentimentMetric.percent ?? 0}%`,
                backgroundColor: sentimentMetric.status.color
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
            <MaterialIcon icon="work_history" style={{ fontSize: '48px', color: workloadMetric.status.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: workloadMetric.status.color }}>
                {workloadMetric.status.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average workload score: {formatPercent(workloadMetric.percent)}
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${workloadMetric.percent ?? 0}%`,
                backgroundColor: workloadMetric.status.color
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
            <MaterialIcon icon="diversity_3" style={{ fontSize: '48px', color: safetyMetric.status.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: safetyMetric.status.color }}>
                {safetyMetric.status.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average support score: {formatPercent(safetyMetric.percent)}
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${safetyMetric.percent ?? 0}%`,
                backgroundColor: safetyMetric.status.color
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
            <MaterialIcon icon="grade" style={{ fontSize: '48px', color: clarityMetric.status.color }} />
            <div className="flex-1 pt-1">
              <span className="text-2xl font-bold block" style={{ color: clarityMetric.status.color }}>
                {clarityMetric.status.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Average valued score: {formatPercent(clarityMetric.percent)}
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all"
              style={{ 
                width: `${clarityMetric.percent ?? 0}%`,
                backgroundColor: clarityMetric.status.color
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

