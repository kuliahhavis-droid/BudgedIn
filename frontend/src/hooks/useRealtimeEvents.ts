import { useEffect } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';

export function useRealtimeEvents() {
  const { session, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !session?.access_token) return;

    // Connect to SSE stream
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/$/, '');
    const eventSource = new EventSource(
      `${baseUrl}/notifications/stream?token=${encodeURIComponent(session.access_token)}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        // Handle different event types
        if (payload.type === 'NEW_NOTIFICATION') {
          toast.success(payload.title, {
            description: payload.message,
            action: {
              label: 'Lihat',
              onClick: () => {
                window.location.href = '/notifications';
              }
            }
          });
          queryClient.setQueryData(['notifications'], (oldData: any) => {
            if (!oldData) return [payload.data];
            if (oldData.some((n: any) => n.id === payload.data.id)) return oldData;
            return [payload.data, ...oldData];
          });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        } 
        else if (payload.type === 'NEW_TRANSACTION') {
          // Silently invalidate transaction/dashboard/budgets queries
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          queryClient.invalidateQueries({ queryKey: ['budgets'] });
        }
        else if (payload.type === 'NEW_BUDGET') {
          // Silently invalidate budgets/dashboard queries
          queryClient.invalidateQueries({ queryKey: ['budgets'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
        else if (payload.type === 'NOTIFICATIONS_UPDATED') {
          if (payload.action === 'markRead') {
            queryClient.setQueryData(['notifications'], (oldData: any) => {
              if (!oldData) return [];
              return oldData.map((n: any) => n.id === payload.id ? { ...n, isRead: true } : n);
            });
          } else if (payload.action === 'markAllRead') {
            queryClient.setQueryData(['notifications'], (oldData: any) => {
              if (!oldData) return [];
              return oldData.map((n: any) => ({ ...n, isRead: true }));
            });
          }
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      } catch (error) {
        console.error('Failed to parse SSE event', error);
      }
    };

    eventSource.onerror = (error) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.warn('SSE Connection Closed');
      } else {
        console.warn('SSE Error (reconnecting...):', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [session, isAuthenticated, queryClient]);
}
