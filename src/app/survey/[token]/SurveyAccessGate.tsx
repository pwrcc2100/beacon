import type { SurveyAccessResult } from '@/lib/surveyToken';

const messages: Record<
  Exclude<SurveyAccessResult['status'], 'ok'>,
  { title: string; body: string }
> = {
  invalid_format: {
    title: 'Invalid link',
    body: 'This survey URL is not valid. Check the link you were sent or request a new one from your organisation.',
  },
  not_found: {
    title: 'Survey not found',
    body: 'We could not find a survey for this link. It may have been mistyped or revoked.',
  },
  expired: {
    title: 'Link expired',
    body: 'This survey link has expired. Please request a new link from your organisation.',
  },
  already_used: {
    title: 'Already completed',
    body: 'This survey link has already been used. Each link can only be submitted once.',
  },
  unavailable: {
    title: 'Temporarily unavailable',
    body: 'We could not verify your link right now. Please try again in a moment.',
  },
};

export function SurveyInvalid({ reason }: { reason: keyof typeof messages }) {
  const { title, body } = messages[reason];
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md rounded-bi-lg border border-bi-border bg-bi-surfaceCard p-6 shadow-bi-md">
        <h1 className="text-lg font-semibold text-bi-text mb-2">{title}</h1>
        <p className="text-sm text-bi-textMuted leading-relaxed">{body}</p>
        <p className="mt-6 text-xs text-bi-textSubtle">
          Need help? Contact your organisation or HR contact who shared the survey.
        </p>
      </div>
    </div>
  );
}

export function SurveyFooter() {
  return (
    <footer className="border-t border-bi-border bg-bi-surface px-4 py-3">
      <p className="text-center text-xs text-bi-textMuted max-w-xl mx-auto">
        Your responses are confidential and used only to produce aggregated insights. No individual answers are
        shared with your manager or organisation.
      </p>
    </footer>
  );
}
