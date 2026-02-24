import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Beacon Advisory – Services',
  description:
    'Senior advisory and hands-on execution support for complex executive initiatives, including business transformation, digital initiatives and enterprise improvement.',
};

export default function AdvisoryPage() {
  redirect('/#advisory');
}
