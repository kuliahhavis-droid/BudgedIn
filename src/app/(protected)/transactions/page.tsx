import { Metadata } from 'next';
import { TransactionsPage } from '@/features/transactions/transactions-page';

export const metadata: Metadata = {
  title: 'Transaksi | BudgedIn',
  description: 'Catat dan kelola pemasukan serta pengeluaran',
};

export default function TransactionsRoute() {
  return <TransactionsPage />;
}
