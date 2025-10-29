import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

export default async function AdminMaterialsPage() {
  // Check authentication
  const authCookie = cookies().get('admin_auth');
  if (!authCookie || authCookie.value !== 'authenticated') {
    redirect('/admin/login');
  }

  const materials = [
    {
      category: 'Client Presentations',
      icon: 'slideshow',
      color: '#64afac',
      items: [
        { name: 'Beacon Platform Summary', url: '/presentation-pdfs/Beacon-Platform-Summary.html', type: 'HTML' },
        { name: 'Client Proposal Template', url: '/presentation-pdfs/Beacon-Client-Proposal.html', type: 'HTML' },
        { name: 'Google Slides Setup Guide', url: '/presentation-pdfs/Beacon-Google-Slides-Setup.html', type: 'HTML' },
      ]
    },
    {
      category: 'Email Templates',
      icon: 'mail',
      color: '#5d89a9',
      items: [
        { name: 'Email Templates Collection', url: '/presentation-pdfs/Beacon-Email-Templates.html', type: 'HTML' },
      ]
    },
    {
      category: 'Survey Design',
      icon: 'quiz',
      color: '#64afac',
      items: [
        { name: 'Survey Questions & Workflow', url: '/presentation-pdfs/Beacon-Survey-Questions.html', type: 'HTML' },
      ]
    },
    {
      category: 'Marketing Materials',
      icon: 'campaign',
      color: '#5d89a9',
      items: [
        { name: 'One-Page Executive Summary', url: '/one-pager', type: 'Web Page' },
        { name: 'Features Page', url: '/features', type: 'Web Page' },
        { name: 'Pricing Page', url: '/pricing', type: 'Web Page' },
      ]
    },
    {
      category: 'Demo & Resources',
      icon: 'dashboard',
      color: '#64afac',
      items: [
        { name: 'Live Dashboard Demo', url: '/dashboard', type: 'Web App' },
        { name: 'Analytics Demo', url: '/analytics', type: 'Web App' },
        { name: 'Methodology Reference', url: '/methodology', type: 'Web Page' },
      ]
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f4ee]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2B4162] to-[#5d89a9] py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MaterialIcon icon="health_and_safety" style={{ fontSize: '40px', color: 'white' }} />
              <div>
                <h1 className="text-3xl font-bold text-white">Beacon Admin</h1>
                <p className="text-white/80 text-sm">Internal Materials & Documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/"
                className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MaterialIcon icon="home" style={{ fontSize: '20px' }} />
                Home
              </a>
              <form action="/api/admin/logout" method="post">
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <MaterialIcon icon="logout" style={{ fontSize: '20px' }} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-8 border-l-4" style={{ borderColor: '#64afac' }}>
          <div className="flex items-start gap-4">
            <MaterialIcon icon="info" style={{ fontSize: '32px', color: '#64afac' }} />
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#2B4162' }}>Welcome to Beacon Admin</h2>
              <p className="text-[#737A8C] leading-relaxed">
                This secure area contains all internal materials, client presentations, email templates, and 
                documentation for Beacon. All documents are accessible online and can be downloaded or printed as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="space-y-8">
          {materials.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${section.color}20` }}
                >
                  <MaterialIcon icon={section.icon} style={{ fontSize: '32px', color: section.color }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: '#2B4162' }}>{section.category}</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-lg border-2 border-gray-200 hover:border-[#64afac] transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1 group-hover:text-[#64afac] transition-colors" style={{ color: '#2B4162' }}>
                          {item.name}
                        </h4>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#eeefec', color: '#737A8C' }}>
                          {item.type}
                        </span>
                      </div>
                      <MaterialIcon 
                        icon="open_in_new" 
                        style={{ fontSize: '20px', color: '#64afac' }} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-br from-[#2B4162] to-[#5d89a9] rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/dashboard"
              className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all text-white"
            >
              <MaterialIcon icon="dashboard" style={{ fontSize: '32px', marginBottom: '8px' }} />
              <div className="font-bold mb-1">View Demo Dashboard</div>
              <div className="text-xs opacity-80">Show clients the live dashboard</div>
            </a>

            <a
              href="/one-pager"
              className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all text-white"
            >
              <MaterialIcon icon="print" style={{ fontSize: '32px', marginBottom: '8px' }} />
              <div className="font-bold mb-1">Print One-Pager</div>
              <div className="text-xs opacity-80">Executive summary for meetings</div>
            </a>

            <a
              href="mailto:hello@beaconwellbeing.com.au"
              className="p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all text-white"
            >
              <MaterialIcon icon="mail" style={{ fontSize: '32px', marginBottom: '8px' }} />
              <div className="font-bold mb-1">Send Email</div>
              <div className="text-xs opacity-80">Use templates from collection</div>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-xs shadow-sm">
            <MaterialIcon icon="lock" style={{ fontSize: '16px', color: '#64afac' }} />
            <span style={{ color: '#737A8C' }}>Secure admin area - All materials are confidential</span>
          </div>
        </div>
      </div>
    </main>
  );
}





