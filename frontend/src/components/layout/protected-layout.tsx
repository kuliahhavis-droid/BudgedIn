'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  BarChart3,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Bot,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUnreadCount } from '@/hooks/use-notifications';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Anggaran', icon: Wallet },
  { href: '/goals', label: 'Target', icon: Target },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/ai-assistant', label: 'Asisten AI', icon: Bot },
  { href: '/profile', label: 'Profil', icon: User },
];

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = useUnreadCount();
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time ? time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) : '';

  const formattedDate = time ? time.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden animate-pulse-glow">
            <img src="/logo.png" alt="BudgedIn Logo" className="h-full w-full object-cover" />
          </div>
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentTitle =
    navItems.find((item) => pathname.startsWith(item.href))?.label ?? 'BudgedIn';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-white md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
            <img src="/logo.png" alt="BudgedIn Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">BudgedIn</p>
            <p className="text-xs text-muted-foreground">Manajer Keuangan</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {user?.fullName ?? 'User'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? ''}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-in-left">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
                  <img src="/logo.png" alt="BudgedIn Logo" className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-semibold">BudgedIn</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                 Keluar
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-sm md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            {time && (
              <div className="hidden md:flex flex-col items-end text-right mr-2 select-none">
                <span className="text-sm font-bold text-emerald-600 font-mono tracking-wider leading-none animate-fade-in">
                  {formattedTime}
                </span>
                <span className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider font-semibold leading-none">
                  {formattedDate}
                </span>
              </div>
            )}
            <Link
              href="/notifications"
              className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-fade-in">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <div className="hidden h-8 w-px bg-border md:block" />
            <div className="hidden items-center gap-2 md:flex">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || ''} />
                <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user?.fullName ?? 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 scrollbar-thin md:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="relative flex h-20 flex-shrink-0 items-end justify-around border-t border-slate-100 bg-white/95 pb-safe backdrop-blur-md md:hidden shadow-lg">
          {/* Transaksi */}
          <Link
            href="/transactions"
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 transition-all duration-300',
              pathname.startsWith('/transactions') ? 'text-primary font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <ArrowLeftRight className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Transaksi</span>
          </Link>

          {/* Anggaran */}
          <Link
            href="/budgets"
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 transition-all duration-300',
              pathname.startsWith('/budgets') ? 'text-primary font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Wallet className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Anggaran</span>
          </Link>

          {/* Big Center Home Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-20">
            <Link
              href="/dashboard"
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white',
                pathname === '/dashboard' ? 'ring-4 ring-emerald-500/20 scale-105' : ''
              )}
            >
              <Home className="h-6 w-6" />
            </Link>
          </div>

          {/* Center Spacer for the Big Home Button */}
          <div className="w-14 shrink-0" />

          {/* Target */}
          <Link
            href="/goals"
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 transition-all duration-300',
              pathname.startsWith('/goals') ? 'text-primary font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <Target className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Target</span>
          </Link>

          {/* Profil */}
          <Link
            href="/profile"
            className={cn(
              'flex flex-1 flex-col items-center justify-center py-2 transition-all duration-300',
              pathname.startsWith('/profile') ? 'text-primary font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
            )}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-[10px]">Profil</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
