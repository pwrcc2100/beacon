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
  const labels = {
    sentiment: [
      'Good – I\'m doing well',
      'Okay – Getting by',
      'Not great – I\'m struggling'
    ],
    clarity: [
      'Clear on what\'s expected',
      'Mostly clear',
      'Unclear about priorities'
    ],
    workload: [
      'Manageable',
      'Busy but okay',
      'Unsustainable'
    ],
    safety: [
      'Comfortable speaking up',
      'Sometimes hesitate',
      'Don\'t feel safe raising issues'
    ],
    leadership: [
      'Supported',
      'Somewhat supported',
      'Not supported'
    ]
  }[id];

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium text-[var(--text-muted)]">
        {label}
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

