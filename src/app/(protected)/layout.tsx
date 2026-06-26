import { ProtectedLayout } from '@/components/layout/protected-layout';

export default function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
