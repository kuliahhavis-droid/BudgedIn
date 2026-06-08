import { Metadata } from 'next';
import { BudgetsPage } from '@/features/budgets/budgets-page';

export const metadata: Metadata = {
  title: 'Anggaran | BudgedIn',
  description: 'Kelola anggaran bulanan mahasiswa',
};

export default function BudgetsRoute() {
  return <BudgetsPage />;
}
