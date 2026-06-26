'use client';

import { Toaster } from 'sonner';
import { QueryProvider } from '../components/providers/query-provider';
import { ThemeProvider } from '../components/providers/theme-provider';
import { AuthProvider } from '../components/providers/auth-provider';
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';

function RealtimeEventProvider({ children }: { children: React.ReactNode }) {
  useRealtimeEvents();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RealtimeEventProvider>
            {children}
            <Toaster richColors position="top-right" />
          </RealtimeEventProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
