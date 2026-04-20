import { SurveyFormWithMobile } from '@/components/survey/SurveyFormWithMobile';
import { validateSurveyAccess } from '@/lib/surveyToken';
import { SurveyFooter, SurveyInvalid } from './SurveyAccessGate';

export default async function SurveyTokenPage({ params }: { params: { token: string } }) {
  const access = await validateSurveyAccess(params.token);

  if (access.status !== 'ok') {
    return (
      <>
        <SurveyInvalid reason={access.status} />
        <SurveyFooter />
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <SurveyFormWithMobile token={params.token} />
      </div>
      <SurveyFooter />
    </div>
  );
}
