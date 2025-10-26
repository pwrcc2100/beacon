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
    clarity: 'How clear are you about your priorities and what\'s expected of you?',
    workload: 'How manageable is your current workload?',
    safety: 'How comfortable do you feel speaking up about concerns or ideas?',
    leadership: 'How supported do you feel by your immediate leadership?'
  }[id];

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
    <fieldset className="space-y-3">
      <legend className="mb-3">
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

