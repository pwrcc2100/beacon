'use client';
import { Card } from '@/components/ui/card';

type Props = {
  position?: 'top' | 'bottom';
};

export function QuoteBanner({ position = 'top' }: Props) {
  const topQuote = {
    text: "Psychological safety is about creating an environment where people feel safe to speak up, take risks, and be vulnerable without fear of negative consequences.",
    emphasis: "It's about the system, processes, and culture — not an assessment of individual mental health."
  };

  const bottomQuote = {
    text: "When we measure psychological safety, we're evaluating how well the organisation provides a supportive working environment through leadership behaviour, workload design, role clarity, and trust in processes.",
    emphasis: "This is organisational health, not individual pathology."
  };

  const quote = position === 'top' ? topQuote : bottomQuote;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl text-indigo-600">💡</span>
          <div>
            <p className="text-sm text-gray-700 mb-2">{quote.text}</p>
            <p className="text-sm font-semibold text-indigo-900 italic">{quote.emphasis}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}



