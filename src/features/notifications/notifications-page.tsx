'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bell, Check, Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-notifications';

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'budget_warning' | 'budget_critical' | 'overspending' | 'goal_achievement' | 'general';
type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
};

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case 'info':
    case 'general':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'success':
    case 'goal_achievement':
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case 'warning':
    case 'budget_warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'error':
    case 'budget_critical':
    case 'overspending':
      return <AlertCircle className="h-5 w-5 text-rose-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notifications = [], isPending } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">Tetap perbarui dengan aktivitas keuangan Anda.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="shrink-0"
          >
            <Check className="mr-2 h-4 w-4" />
            Tandai semua sudah dibaca
          </Button>
        )}
      </div>

      <Card className="rounded-3xl shadow-soft border-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="all">
                Semua
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {notifications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Belum Dibaca
                {unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPending ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border bg-card">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-medium">Tidak ada notifikasi</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  {filter === 'unread' 
                    ? "Anda sudah membaca semuanya! Tidak ada notifikasi yang belum dibaca."
                    : "Anda belum memiliki notifikasi. Kami akan memberitahu Anda jika ada pembaruan."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  return (
                    <div 
                      key={notification.id}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                      className={cn(
                        "group relative flex gap-4 p-4 rounded-2xl border transition-all duration-200",
                        notification.isRead ? "bg-card/50 opacity-75" : "bg-card shadow-sm border-emerald-100 cursor-pointer hover:border-emerald-300"
                      )}
                    >
                      {!notification.isRead && (
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                      
                      <div className="shrink-0 mt-1">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          (notification.type === 'info' || notification.type === 'general') && "bg-blue-100",
                          (notification.type === 'success' || notification.type === 'goal_achievement') && "bg-emerald-100",
                          (notification.type === 'warning' || notification.type === 'budget_warning') && "bg-amber-100",
                          (notification.type === 'error' || notification.type === 'budget_critical' || notification.type === 'overspending') && "bg-rose-100",
                        )}>
                          {getIconForType(notification.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <h4 className={cn(
                            "text-sm font-semibold leading-none",
                            !notification.isRead && "text-emerald-700 dark:text-emerald-400"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: id })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        {!notification.isRead && (
                          <div className="mt-2 pt-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                              Klik untuk menandai sudah dibaca
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
