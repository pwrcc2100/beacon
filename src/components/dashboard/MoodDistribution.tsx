'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

type Props = {
  responses: Array<{
    safety_5: number;
  }>;
};

export function MoodDistribution({ responses }: Props) {
  // Map psychological safety responses to 3 categories
  // The survey uses a 3-point scale mapped to 5-point internally
  // 5 (Yes, always) = Safe to speak up
  // 3 (Sometimes) = Unsure/Mixed
  // 1 (No, not really) = Not safe
  
  const safe = responses.filter(r => r.safety_5 >= 4).length; // 4-5 = Yes/Always
  const mixed = responses.filter(r => r.safety_5 === 3).length; // 3 = Sometimes
  const notSafe = responses.filter(r => r.safety_5 <= 2).length; // 1-2 = No/Not really

  const total = responses.length || 1;
  const atRisk = notSafe;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">How safe do people feel speaking up?</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Safety response icons row - 3 options */}
          <div className="flex justify-around items-end">
            <div className="text-center">
              <MaterialIcon icon="check_circle" style={{ fontSize: '48px', color: '#64afac' }} className="mb-1" />
              <div className="text-xs text-muted-foreground font-medium">Yes, I feel safe</div>
              <div className="text-xl font-bold" style={{ color: '#64afac' }}>{safe}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{Math.round((safe / total) * 100)}%</div>
            </div>
            <div className="text-center">
              <MaterialIcon icon="help" style={{ fontSize: '48px', color: '#5d89a9' }} className="mb-1" />
              <div className="text-xs text-muted-foreground font-medium">Sometimes</div>
              <div className="text-xl font-bold" style={{ color: '#5d89a9' }}>{mixed}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{Math.round((mixed / total) * 100)}%</div>
            </div>
            <div className="text-center">
              <MaterialIcon icon="cancel" style={{ fontSize: '48px', color: '#ea9999' }} className="mb-1" />
              <div className="text-xs text-muted-foreground font-medium">No, not really</div>
              <div className="text-xl font-bold" style={{ color: '#ea9999' }}>{notSafe}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{Math.round((notSafe / total) * 100)}%</div>
            </div>
          </div>

          {/* Insight box */}
          <div className="rounded-lg p-2" style={{ backgroundColor: '#eeefec', borderColor: '#5d89a9', border: '1px solid #5d89a9' }}>
            <div className="flex items-start gap-2">
              <MaterialIcon icon="insights" style={{ fontSize: '16px', color: '#5d89a9' }} />
              <div className="text-xs leading-snug" style={{ color: '#2E2E38' }}>
                <strong>What this means:</strong> {safe} people ({Math.round((safe / total) * 100)}% out of {total}) feel safe speaking up about concerns. {atRisk > 0 ? `${atRisk} people don't feel safe - this indicates systemic or cultural issues that need addressing.` : 'No one reported feeling unsafe - this is a positive indicator of psychological safety.'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

