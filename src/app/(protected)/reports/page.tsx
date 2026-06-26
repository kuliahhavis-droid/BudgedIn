import { ReportsPage } from '@/features/reports/reports-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports & Analytics | BudgedIn',
  description: 'View your financial reports and analytics',
};

export default function Page() {
  return <ReportsPage />;
}
