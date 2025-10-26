'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type QuestionId = 'sentiment' | 'workload' | 'safety' | 'leadership' | 'clarity';
type Answer = 1 | 2 | 3;

export default function SurveyPreview() {
  const [step, setStep] = useState<'intro' | 'questions' | 'support-ask' | 'support-options' | 'comments' | 'resources' | 'thanks'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, Answer>>({} as any);
  const [supportRequested, setSupportRequested] = useState<boolean | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<string>('');
  const [contactValue, setContactValue] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [comments, setComments] = useState<string>('');

  const questions = [
    {
      id: 'sentiment' as QuestionId,
      label: 'Sentiment / Overall',
      question: 'How are you feeling about work this week?',
      options: [
        { value: 1, label: 'Good – I\'m doing well', emoji: '😊', color: '#64afac' },
        { value: 2, label: 'Okay – Getting by', emoji: '😐', color: '#f59e0b' },
        { value: 3, label: 'Not great – I\'m struggling', emoji: '😟', color: '#ea9999' }
      ]
    },
    {
      id: 'workload' as QuestionId,
      label: 'Workload / Capacity',
      question: 'How\'s your workload?',
      options: [
        { value: 1, label: 'Manageable', emoji: '✅', color: '#64afac' },
        { value: 2, label: 'Busy but okay', emoji: '😐', color: '#f59e0b' },
        { value: 3, label: 'Unsustainable', emoji: '🔴', color: '#ea9999' }
      ]
    },
    {
      id: 'safety' as QuestionId,
      label: 'Psychological Safety',
      question: 'Do you feel safe speaking up?',
      options: [
        { value: 1, label: 'Comfortable speaking up', emoji: '✅', color: '#64afac' },
        { value: 2, label: 'Sometimes hesitate', emoji: '🤔', color: '#f59e0b' },
        { value: 3, label: 'Don\'t feel safe raising issues', emoji: '❌', color: '#ea9999' }
      ]
    },
    {
      id: 'leadership' as QuestionId,
      label: 'Leadership Support',
      question: 'Do you feel supported by leadership?',
      options: [
        { value: 1, label: 'Supported', emoji: '✅', color: '#64afac' },
        { value: 2, label: 'Somewhat supported', emoji: '😐', color: '#f59e0b' },
        { value: 3, label: 'Not supported', emoji: '❌', color: '#ea9999' }
      ]
    },
    {
      id: 'clarity' as QuestionId,
      label: 'Clarity / Direction',
      question: 'Are you clear on what\'s expected?',
      options: [
        { value: 1, label: 'Clear on what\'s expected', emoji: '✅', color: '#64afac' },
        { value: 2, label: 'Mostly clear', emoji: '😐', color: '#f59e0b' },
        { value: 3, label: 'Unclear about priorities', emoji: '❓', color: '#ea9999' }
      ]
    }
  ];

  const hasHighRiskAnswers = Object.values(answers).some(a => a === 3);

  const renderIntro = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Confidential Wellbeing Check-In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">
          This is a confidential wellbeing check-in. Your responses help us identify systemic issues and improve our workplace culture.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="font-semibold text-blue-900">🔒 How we protect your privacy:</div>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Individual responses are confidential</li>
            <li>✓ Only aggregated data is shared with leadership</li>
            <li>✓ If you request support, only your designated contact person will know</li>
            <li>✓ This is about organisational health, not individual performance</li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          This survey takes about 2 minutes to complete.
        </div>

        <Button onClick={() => setStep('questions')} className="w-full" size="lg">
          Continue to Survey
        </Button>
      </CardContent>
    </Card>
  );

  const renderQuestions = () => {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">Question {currentQuestion + 1} of {questions.length}</Badge>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <CardTitle className="text-xl">{q.question}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{q.label}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map(opt => {
            const isSelected = answers[q.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setAnswers({ ...answers, [q.id]: opt.value as Answer });
                  setTimeout(() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      // Check if support is needed
                      if (hasHighRiskAnswers || Object.values({...answers, [q.id]: opt.value}).some(a => a === 3)) {
                        setStep('support-ask');
                      } else {
                        setStep('comments');
                      }
                    }
                  }, 300);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-base font-medium flex-1">{opt.label}</span>
              </button>
            );
          })}

          {currentQuestion > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-4"
            >
              ← Previous Question
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSupportAsk = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Support Available</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">
          Thank you for sharing. Would you like someone to reach out to offer support?
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => {
              setSupportRequested(true);
              setStep('support-options');
            }}
            className="w-full justify-start h-auto p-4"
            size="lg"
          >
            <span className="text-lg mr-3">✅</span>
            <span className="text-left">
              <div className="font-semibold">Yes, I'd like to be contacted</div>
              <div className="text-sm font-normal opacity-90">Connect me with support resources</div>
            </span>
          </Button>

          <Button 
            onClick={() => {
              setSupportRequested(false);
              setStep('comments');
            }}
            variant="outline"
            className="w-full justify-start h-auto p-4"
            size="lg"
          >
            <span className="text-lg mr-3">❌</span>
            <span className="text-left">
              <div className="font-semibold">No thanks, I'm managing</div>
              <div className="text-sm font-normal opacity-70">Continue to survey</div>
            </span>
          </Button>

          <Button 
            variant="outline"
            className="w-full justify-start h-auto p-4"
            size="lg"
          >
            <span className="text-lg mr-3">ℹ️</span>
            <span className="text-left">
              <div className="font-semibold">Tell me more about available support</div>
              <div className="text-sm font-normal opacity-70">See what help is available</div>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSupportOptions = () => {
    const availableContacts = [
      { id: 'hr', label: 'HR Team', description: 'Confidential support from Human Resources' },
      { id: 'whs', label: 'WHS Leader', description: 'Work Health & Safety specialist' },
      { id: 'manager', label: 'My Direct Manager', description: 'Speak with your team leader' },
      { id: 'leadership', label: 'Senior Leadership', description: 'Escalate to senior management' },
      { id: 'eap', label: 'EAP (Employee Assistance Program)', description: 'Professional counselling service' },
      { id: 'other', label: 'Other', description: 'Specify who you\'d like to contact' }
    ];

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Support Options</CardTitle>
          <p className="text-sm text-muted-foreground">Select who you'd like to connect with</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Who would you like to connect with? (Select all that apply)</label>
            <div className="space-y-2">
              {availableContacts.map(contact => (
                <label key={contact.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([...selectedContacts, contact.id]);
                      } else {
                        setSelectedContacts(selectedContacts.filter(c => c !== contact.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{contact.label}</div>
                    <div className="text-sm text-muted-foreground">{contact.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Method */}
          <div>
            <label className="text-sm font-semibold mb-3 block">How should they contact you?</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="contact-method" 
                  value="work-email"
                  checked={contactMethod === 'work-email'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                <span>My work email (user@company.com)</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="contact-method" 
                  value="personal-email"
                  checked={contactMethod === 'personal-email'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                <div className="flex-1">
                  <span>Different email</span>
                  {contactMethod === 'personal-email' && (
                    <input 
                      type="email" 
                      placeholder="personal@email.com"
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      className="mt-2 w-full border rounded px-3 py-2 text-sm"
                    />
                  )}
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="contact-method" 
                  value="phone"
                  checked={contactMethod === 'phone'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                <div className="flex-1">
                  <span>Mobile phone</span>
                  {contactMethod === 'phone' && (
                    <input 
                      type="tel" 
                      placeholder="04XX XXX XXX"
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      className="mt-2 w-full border rounded px-3 py-2 text-sm"
                    />
                  )}
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="contact-method" 
                  value="anonymous"
                  checked={contactMethod === 'anonymous'}
                  onChange={(e) => setContactMethod(e.target.value)}
                />
                <span>Request anonymous meeting (HR will arrange)</span>
              </label>
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Preferred timeframe</label>
            <div className="space-y-2">
              {['Within 24 hours', 'Within this week', 'When convenient'].map(tf => (
                <label key={tf} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="timeframe" 
                    value={tf}
                    checked={timeframe === tf}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                  <span>{tf}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('support-ask')}>
              ← Back
            </Button>
            <Button 
              onClick={() => setStep('comments')} 
              className="flex-1"
              disabled={selectedContacts.length === 0 || !contactMethod || !timeframe}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComments = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Additional Comments (Optional)</CardTitle>
        <p className="text-sm text-muted-foreground">Is there anything else you'd like to share?</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          maxLength={500}
          rows={6}
          placeholder="Your comments are confidential and help us understand the full picture..."
          className="w-full border rounded-lg p-3 text-sm resize-none"
        />
        <div className="text-xs text-muted-foreground text-right">
          {comments.length} / 500 characters
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep(supportRequested ? 'support-options' : 'support-ask')}
          >
            ← Back
          </Button>
          <Button 
            onClick={() => {
              if (hasHighRiskAnswers) {
                setStep('resources');
              } else {
                setStep('thanks');
              }
            }} 
            className="flex-1"
          >
            {hasHighRiskAnswers ? 'Continue' : 'Finish Survey'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderResources = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>You're Not Alone</CardTitle>
        <p className="text-sm text-muted-foreground">Immediate support available</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">
          Thank you for completing the survey. Remember, help is always available.
        </p>

        <div className="space-y-3">
          <a href="tel:131114" className="block">
            <Button variant="outline" className="w-full justify-start h-auto p-4" size="lg">
              <span className="text-2xl mr-3">📞</span>
              <div className="text-left flex-1">
                <div className="font-semibold">Lifeline</div>
                <div className="text-sm font-normal opacity-70">13 11 14 - 24/7 crisis support</div>
              </div>
            </Button>
          </a>

          <a href="tel:1300224636" className="block">
            <Button variant="outline" className="w-full justify-start h-auto p-4" size="lg">
              <span className="text-2xl mr-3">🌐</span>
              <div className="text-left flex-1">
                <div className="font-semibold">Beyond Blue</div>
                <div className="text-sm font-normal opacity-70">1300 22 4636 - Mental health support</div>
              </div>
            </Button>
          </a>

          <a href="https://www.safeworkaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" className="w-full justify-start h-auto p-4" size="lg">
              <span className="text-2xl mr-3">💼</span>
              <div className="text-left flex-1">
                <div className="font-semibold">SafeWork Australia</div>
                <div className="text-sm font-normal opacity-70">Workplace safety resources</div>
              </div>
            </Button>
          </a>

          <a href="mailto:hr@company.com" className="block">
            <Button variant="outline" className="w-full justify-start h-auto p-4" size="lg">
              <span className="text-2xl mr-3">📧</span>
              <div className="text-left flex-1">
                <div className="font-semibold">HR Support</div>
                <div className="text-sm font-normal opacity-70">hr@company.com</div>
              </div>
            </Button>
          </a>
        </div>

        <p className="text-sm text-muted-foreground text-center italic">
          These services are free and confidential
        </p>

        <Button onClick={() => setStep('thanks')} className="w-full" size="lg">
          Finish Survey
        </Button>
      </CardContent>
    </Card>
  );

  const renderThanks = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Thank You for Your Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-base">
          Your responses help us build a safer, more supportive workplace for everyone.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="font-semibold text-green-900">✓ What happens next:</div>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Your individual responses remain confidential</li>
            <li>• Leadership sees only aggregated trends</li>
            {supportRequested && <li>• You'll be contacted within your requested timeframe</li>}
            <li>• The next check-in will be sent in 1 week</li>
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="font-semibold text-slate-900 mb-2">Need immediate help?</div>
          <div className="text-sm text-slate-700">
            Contact HR: hr@company.com | 📞 Extension 1234
          </div>
        </div>

        <Button onClick={() => {
          // Reset for demo
          setStep('intro');
          setCurrentQuestion(0);
          setAnswers({} as any);
          setSupportRequested(null);
          setSelectedContacts([]);
          setContactMethod('');
          setContactValue('');
          setTimeframe('');
          setComments('');
        }} variant="outline" className="w-full">
          ↻ Start Over (Demo)
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Demo Header */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100">PREVIEW MODE</Badge>
              <span className="text-sm">
                This is a demo of the enhanced survey flow. No data is saved.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Survey Content */}
        {step === 'intro' && renderIntro()}
        {step === 'questions' && renderQuestions()}
        {step === 'support-ask' && renderSupportAsk()}
        {step === 'support-options' && renderSupportOptions()}
        {step === 'comments' && renderComments()}
        {step === 'resources' && renderResources()}
        {step === 'thanks' && renderThanks()}
      </div>
    </div>
  );
}



