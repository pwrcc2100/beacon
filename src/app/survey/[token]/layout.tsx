export default function SurveyTokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="beacon-app min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b border-bi-border bg-bi-surface px-4 py-3">
        <h1 className="text-lg font-semibold text-bi-text">Beacon Index</h1>
        <span className="ml-3 text-sm text-bi-textMuted">Weekly pulse</span>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
