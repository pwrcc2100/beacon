import { SurveyFormWithMobile } from '@/components/survey/SurveyFormWithMobile';

export default function SurveyTokenPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <SurveyFormWithMobile token={params.token} />
      </div>
      <footer className="border-t border-bi-border bg-bi-surface px-4 py-3">
        <p className="text-center text-xs text-bi-textMuted max-w-xl mx-auto">
          Your responses are confidential and used only to produce aggregated insights. No individual answers are shared with your manager or organisation.
        </p>
      </footer>
    </div>
  );
}
