import { SurveyFormWithMobile } from '@/components/survey/SurveyFormWithMobile';

export default function SurveyTokenPage({ params }: { params: { token: string } }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <SurveyFormWithMobile token={params.token} />
    </main>
  );
}

