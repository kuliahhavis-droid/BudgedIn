import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dasbor' },
  { href: '/transactions', label: 'Transaksi' },
  { href: '/budgets', label: 'Anggaran' },
  { href: '/goals', label: 'Target' },
  { href: '/reports', label: 'Laporan' },
  { href: '/profile', label: 'Profil' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_45%,#F8FAFC_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-6 pt-4 md:px-6 lg:px-8">
        <header className="mb-4 rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 shadow-soft backdrop-blur md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">B</div>
                <div>
                  <p className="text-lg font-semibold">BudgedIn</p>
                  <p className="text-sm text-slate-500">Manajemen Keuangan Cerdas untuk Mahasiswa</p>
                </div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Badge variant="success">Sinkron</Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Keluar</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
