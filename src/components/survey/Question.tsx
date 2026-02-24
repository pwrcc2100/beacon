import { Option } from './Option';

type Id = 'sentiment' | 'clarity' | 'workload' | 'safety' | 'leadership';

export function Question({
  id,
  label,
  value,
  onChange
}: {
  id: Id;
  label: string;
  value?: 1 | 2 | 3;
  onChange: (v: 1 | 2 | 3) => void;
}) {
  const questionText = {
    sentiment: 'How are you feeling about work this week?',
    clarity: 'How clear are you on your priorities and what’s expected of you?',
    workload: 'How manageable is your current workload?',
    safety: 'How comfortable do you feel raising concerns when something isn’t right?',
    leadership: 'How supported do you feel by your immediate leadership?'
  }[id];

  const labels = {
    sentiment: [
      'Feeling positive and energised about work',
      'Fine overall',
      'Not great – I’m struggling this week'
    ],
    clarity: [
      'Very clear on priorities and expectations',
      'Mostly clear, a few grey areas',
      'Unclear – need more direction'
    ],
    workload: [
      'Manageable – workload feels sustainable',
      'Busy but still manageable',
      'Unsustainable – workload isn’t manageable'
    ],
    safety: [
      'Very comfortable raising concerns',
      'Sometimes hesitate before speaking up',
      'Not comfortable raising concerns'
    ],
    leadership: [
      'Consistently supported by my leader',
      'Support is mixed',
      'I don’t feel supported by leadership'
    ]
  }[id];

  return (
    <fieldset className="space-y-3">
      <legend className="mb-3">
        {label && (
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">
            {label}
          </div>
        )}
        <div className="text-lg font-semibold text-[var(--text-primary)]">
          {questionText}
        </div>
      </legend>
      <Option
        value3={1}
        label={labels[0]}
        variant="good"
        selected={value === 1}
        onSelect={onChange}
      />
      <Option
        value3={2}
        label={labels[1]}
        variant="okay"
        selected={value === 2}
        onSelect={onChange}
      />
      <Option
        value3={3}
        label={labels[2]}
        variant="attention"
        selected={value === 3}
        onSelect={onChange}
      />
    </fieldset>
  );
}

