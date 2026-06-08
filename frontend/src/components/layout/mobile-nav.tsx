'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  MoreHorizontal,
  BarChart3,
  User,
  X,
  Bot,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Anggaran', icon: Wallet },
  { href: '/goals', label: 'Target', icon: Target },
];

const moreItems = [
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/ai-assistant', label: 'Asisten AI', icon: Bot },
  { href: '/profile', label: 'Profil', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreRef = React.useRef<HTMLDivElement>(null);

  // Close the "More" popup on click outside
  React.useEffect(() => {
    if (!moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [moreOpen]);

  const isMoreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all',
                isActive
                  ? 'text-primary scale-105'
                  : 'text-slate-400 active:scale-95'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}

        {/* More button */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all',
              moreOpen || isMoreActive
                ? 'text-primary scale-105'
                : 'text-slate-400 active:scale-95'
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Lainnya</span>
          </button>

          {/* More popup */}
          {moreOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lainnya</span>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {moreItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/5 font-medium text-primary'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
