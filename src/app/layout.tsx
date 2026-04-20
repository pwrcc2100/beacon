import '../styles/globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'Beacon Advisory',
  description:
    'Project-based operational support — scoped, delivered and embedded in your business.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=location.pathname||'';if(p==='/'||p==='/about'){document.documentElement.classList.remove('dark');return;}var t=localStorage.getItem('beacon-theme');var d=!(t==='light'||(t!=='dark'&&window.matchMedia('(prefers-color-scheme: light)').matches));document.documentElement.classList.toggle('dark',d);})();`,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
