import '../styles/globals.css';

export const metadata = {
  title: 'Beacon - Team Wellbeing Surveys',
  description: 'Anonymous team wellbeing surveys for better workplace culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

