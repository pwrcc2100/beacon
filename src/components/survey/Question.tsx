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
    clarity: 'I feel I understand what\'s expected of me.',
    workload: 'I feel my workload is reasonable for the time available.',
    safety: 'I feel safe to speak up if something isn\'t right.',
    leadership: 'I feel my leader supports me when challenges arise.'
  }[id];

  const labels = {
    sentiment: [
      'Doing well – feeling positive about work',
      'Okay overall',
      'Not great – I\'m struggling'
    ],
    clarity: [
      'Yes – I have clear direction',
      'Mostly clear',
      'No – priorities are unclear'
    ],
    workload: [
      'Workload is reasonable',
      'Busy but manageable',
      'Unsustainable right now'
    ],
    safety: [
      'Yes – I feel safe speaking up',
      'Sometimes hesitant',
      'No – I don\'t feel safe raising issues'
    ],
    leadership: [
      'My leader supports me',
      'Support is inconsistent',
      'I don\'t feel supported'
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

