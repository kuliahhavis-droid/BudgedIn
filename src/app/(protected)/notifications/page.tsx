import { NotificationsPage } from '@/features/notifications/notifications-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | BudgedIn',
  description: 'View your recent notifications and alerts',
};

export default function Page() {
  return <NotificationsPage />;
}
