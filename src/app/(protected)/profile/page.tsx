import { ProfilePage } from '@/features/profile/profile-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings | BudgedIn',
  description: 'Manage your profile and account settings',
};

export default function Page() {
  return <ProfilePage />;
}
