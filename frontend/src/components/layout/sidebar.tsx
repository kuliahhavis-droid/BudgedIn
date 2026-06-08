'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  BarChart3,
  User,
  ChevronsLeft,
  ChevronsRight,
  Bot,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/avatar';
import { Tooltip } from '../ui/tooltip';
import { Separator } from '../ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Dasbor', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Anggaran', icon: Wallet },
  { href: '/goals', label: 'Target', icon: Target },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/ai-assistant', label: 'Asisten AI', icon: Bot },
  { href: '/profile', label: 'Profil', icon: User },
];

export interface SidebarProps {
  user?: {
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({ user, collapsed = false, onCollapsedChange, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex',
        collapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center gap-3 border-b border-slate-100 px-4', collapsed && 'justify-center')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-glow">
          B
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-slate-900">BudgedIn</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.href} content={item.label} side="right">
              {link}
            </Tooltip>
          ) : (
            <React.Fragment key={item.href}>{link}</React.Fragment>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      {onCollapsedChange && (
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span>Tutup</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* User info */}
      {user && (
        <>
          <Separator />
          <div className={cn('flex items-center gap-3 p-4', collapsed && 'justify-center p-3')}>
            <Avatar
              src={user.avatarUrl}
              fallback={user.fullName}
              size="sm"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
