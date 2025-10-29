import { SurveyForm } from '@/components/survey/SurveyForm';

export default function SurveyTokenPage({ params }: { params: { token: string } }) {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <SurveyForm token={params.token} />
      </div>
    </main>
  );
}

