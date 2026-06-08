import { Metadata } from 'next';
import { DashboardView } from '@/features/dashboard/dashboard-view';

export const metadata: Metadata = {
  title: 'Dashboard | BudgedIn',
  description: 'Dasbor pemantauan keuangan mahasiswa',
};

export default function DashboardPage() {
  return <DashboardView />;
}
