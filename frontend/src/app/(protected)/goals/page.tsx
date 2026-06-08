import { Metadata } from 'next';
import { GoalsPage } from '@/features/goals/goals-page';

export const metadata: Metadata = {
  title: 'Target Tabungan | BudgedIn',
  description: 'Kelola target dan rencana tabungan mahasiswa',
};

export default function GoalsRoute() {
  return <GoalsPage />;
}
