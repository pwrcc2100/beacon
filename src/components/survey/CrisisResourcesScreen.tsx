'use client';

interface CrisisResourcesScreenProps {
  riskFactors: string[];
  onComplete: () => void;
}

export function CrisisResourcesScreen({ riskFactors, onComplete }: CrisisResourcesScreenProps) {
  const resources = [
    {
      name: 'Lifeline',
      number: '13 11 14',
      icon: '📞',
      link: 'tel:131114',
      description: '24/7 crisis support'
    },
    {
      name: 'Beyond Blue',
      number: '1300 22 4636',
      icon: '🌐',
      link: 'tel:1300224636',
      description: 'Mental health support'
    },
    {
      name: 'SafeWork Australia',
      icon: '💼',
      link: 'https://www.safeworkaustralia.gov.au',
      description: 'Workplace safety resources'
    },
    {
      name: 'EAP Support',
      number: 'Your organisation\'s EAP provider',
      icon: '🏥',
      link: 'tel:1300XXX',
      description: 'Employee Assistance Program'
    },
    {
      name: 'HR Support',
      icon: '📧',
      link: 'mailto:hr@company.com',
      description: 'Contact your HR team'
    }
  ];

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 my-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-red-900 mb-2">
          Thank you for completing the survey
        </h3>
        <p className="text-base text-red-800">
          Remember, you're not alone. Immediate support is available:
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {resources.map((resource) => (
          <a
            key={resource.name}
            href={resource.link}
            className="block w-full px-4 py-3 bg-white border-2 border-red-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors flex items-center gap-3"
          >
            <span className="text-2xl">{resource.icon}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-red-900">{resource.name}</div>
              {resource.number && (
                <div className="text-sm text-red-700">{resource.number}</div>
              )}
              <div className="text-xs text-red-600">{resource.description}</div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-center text-red-700 italic mb-4">
        These services are free, confidential, and available 24/7.
      </p>

      <button
        onClick={onComplete}
        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Finish Survey
      </button>
    </div>
  );
}


