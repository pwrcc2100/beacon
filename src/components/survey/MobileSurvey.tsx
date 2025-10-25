'use client';
import { useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

interface MobileSurveyProps {
  onSubmit: (responses: Record<string, 1 | 2 | 3>) => void;
  isSubmitting: boolean;
}

const questions = [
  {
    id: 'sentiment',
    question: 'How are you feeling overall about your work situation?',
    options: [
      { value: 1, label: 'Good – I\'m doing well', color: '#64afac' },
      { value: 2, label: 'Okay – Getting by', color: '#5d89a9' },
      { value: 3, label: 'Not great – I\'m struggling', color: '#ea9999' }
    ]
  },
  {
    id: 'clarity',
    question: 'How clear are you about your priorities and what\'s expected of you?',
    options: [
      { value: 1, label: 'Clear on what\'s expected', color: '#64afac' },
      { value: 2, label: 'Mostly clear', color: '#5d89a9' },
      { value: 3, label: 'Unclear about priorities', color: '#ea9999' }
    ]
  },
  {
    id: 'workload',
    question: 'How manageable is your current workload?',
    options: [
      { value: 1, label: 'Manageable', color: '#64afac' },
      { value: 2, label: 'Busy but okay', color: '#5d89a9' },
      { value: 3, label: 'Unsustainable', color: '#ea9999' }
    ]
  },
  {
    id: 'safety',
    question: 'How comfortable do you feel speaking up about concerns or ideas?',
    options: [
      { value: 1, label: 'Comfortable speaking up', color: '#64afac' },
      { value: 2, label: 'Sometimes hesitate', color: '#5d89a9' },
      { value: 3, label: 'Don\'t feel safe raising issues', color: '#ea9999' }
    ]
  },
  {
    id: 'leadership',
    question: 'How supported do you feel by your immediate leadership?',
    options: [
      { value: 1, label: 'Supported', color: '#64afac' },
      { value: 2, label: 'Somewhat supported', color: '#5d89a9' },
      { value: 3, label: 'Not supported', color: '#ea9999' }
    ]
  }
];

export function MobileSurvey({ onSubmit, isSubmitting }: MobileSurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, 1 | 2 | 3>>({});

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const handleOptionSelect = (value: number) => {
    const newResponses = { ...responses, [question.id]: value };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      // Move to next question after a brief delay for visual feedback
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Last question - submit after brief delay
      setTimeout(() => {
        onSubmit(newResponses);
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header with progress */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                disabled={isSubmitting}
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: responses[question.id] === option.value ? option.color : undefined,
                  backgroundColor: responses[question.id] === option.value ? `${option.color}10` : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium text-left">
                    {option.label}
                  </span>
                  {responses[question.id] === option.value && (
                    <MaterialIcon 
                      icon="check_circle" 
                      style={{ color: option.color, fontSize: '24px' }} 
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              className="w-full mt-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MaterialIcon icon="arrow_back" style={{ fontSize: '20px' }} />
              <span className="ml-2">Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-xs text-gray-500">
            Takes less than 2 minutes • Completely confidential
          </p>
        </div>
      </div>
    </div>
  );
}
