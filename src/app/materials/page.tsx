'use client';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default function MaterialsPage() {
  const materials = [
    {
      title: 'Survey Overview',
      description: 'Client-facing overview of the Beacon Wellbeing Survey',
      url: '/presentation-pdfs/Beacon-Survey-Overview.html',
      icon: 'description',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'Platform Summary',
      description: 'Technical overview and feature descriptions',
      url: '/presentation-pdfs/Beacon-Platform-Summary.html',
      icon: 'dashboard',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'Client Proposal Template',
      description: 'Formal proposal template with pricing',
      url: '/presentation-pdfs/Beacon-Client-Proposal.html',
      icon: 'contract',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'Email Templates',
      description: 'Copy/paste templates for client communications',
      url: '/presentation-pdfs/Beacon-Email-Templates.html',
      icon: 'mail',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'One-Pager',
      description: 'Executive summary - best for meetings',
      url: '/one-pager',
      icon: 'article',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'Dashboard & Insights Summary',
      description: 'Overview of analytics, metrics, and executive intelligence',
      url: '/presentation-pdfs/Beacon-Dashboard-Insights.html',
      icon: 'analytics',
      category: 'Client-Facing',
      safe: true
    },
    {
      title: 'Survey Questions (Detailed)',
      description: 'Full question set and logic - KEEP PRIVATE',
      url: '/presentation-pdfs/Beacon-Survey-Questions.html',
      icon: 'quiz',
      category: 'Internal Only',
      safe: false
    },
    {
      title: 'Google Slides Setup',
      description: 'Instructions for creating presentations',
      url: '/presentation-pdfs/Beacon-Google-Slides-Setup.html',
      icon: 'slideshow',
      category: 'Internal Only',
      safe: false
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <a href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <MaterialIcon icon="arrow_back" style={{ fontSize: '24px', color: '#64afac' }} />
            <span style={{ color: '#2B4162' }}>Back to Home</span>
          </a>
          
          <div className="flex items-center gap-4 mb-4">
            <MaterialIcon icon="folder_open" style={{ fontSize: '48px', color: '#64afac' }} />
            <div>
              <h1 className="text-4xl font-bold" style={{ color: '#2B4162' }}>Marketing Materials</h1>
              <p className="text-lg" style={{ color: '#737A8C' }}>All Beacon Wellbeing documents in one place</p>
            </div>
          </div>
        </div>

        {/* Client-Facing Materials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2" style={{ color: '#2B4162', borderColor: '#64afac' }}>
            <MaterialIcon icon="public" style={{ fontSize: '28px', color: '#64afac', marginRight: '0.5rem' }} />
            Client-Facing Materials
          </h2>
          <p className="mb-6" style={{ color: '#737A8C' }}>
            ✅ Safe to share with clients, prospects, and partners
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {materials.filter(m => m.category === 'Client-Facing').map((material) => (
              <a
                key={material.url}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105"
                style={{ borderColor: '#cbd5e1', backgroundColor: '#fff' }}
              >
                <div className="flex items-start gap-4">
                  <MaterialIcon icon={material.icon} style={{ fontSize: '40px', color: '#64afac' }} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>
                      {material.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#737A8C' }}>
                      {material.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#64afac' }}>
                      <span>View Document</span>
                      <MaterialIcon icon="open_in_new" style={{ fontSize: '16px' }} />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Internal Materials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2" style={{ color: '#2B4162', borderColor: '#ea9999' }}>
            <MaterialIcon icon="lock" style={{ fontSize: '28px', color: '#ea9999', marginRight: '0.5rem' }} />
            Internal Only
          </h2>
          <p className="mb-6" style={{ color: '#737A8C' }}>
            ❌ Keep private - contains intellectual property and trade secrets
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {materials.filter(m => m.category === 'Internal Only').map((material) => (
              <a
                key={material.url}
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105"
                style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5' }}
              >
                <div className="flex items-start gap-4">
                  <MaterialIcon icon={material.icon} style={{ fontSize: '40px', color: '#ea9999' }} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#2B4162' }}>
                      {material.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#737A8C' }}>
                      {material.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#ea9999' }}>
                      <span>View Document</span>
                      <MaterialIcon icon="open_in_new" style={{ fontSize: '16px' }} />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: '#f4f4ee' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#2B4162' }}>
            <MaterialIcon icon="lightbulb" style={{ fontSize: '24px', color: '#64afac', marginRight: '0.5rem' }} />
            Quick Tips
          </h3>
          <ul className="space-y-2" style={{ color: '#737A8C' }}>
            <li className="flex items-start gap-2">
              <MaterialIcon icon="print" style={{ fontSize: '20px', color: '#64afac' }} />
              <span>Click the <strong>Print / Save PDF</strong> button on any document to create a PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon icon="share" style={{ fontSize: '20px', color: '#64afac' }} />
              <span>All client-facing materials are safe to share externally</span>
            </li>
            <li className="flex items-start gap-2">
              <MaterialIcon icon="security" style={{ fontSize: '20px', color: '#ea9999' }} />
              <span>Never share "Internal Only" documents - they contain IP and trade secrets</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

