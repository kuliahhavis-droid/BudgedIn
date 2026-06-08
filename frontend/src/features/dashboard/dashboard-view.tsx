'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowRight,
  Target,
  ShieldCheck,
  Wallet,
  PlusCircle,
  Utensils,
  Car,
  Home,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  Wifi,
  Coins,
  Laptop,
  Heart,
  HelpCircle,
  Umbrella,
  Baby,
  PartyPopper,
  Shield,
} from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton, ChartSkeleton, Skeleton } from '@/components/ui/loading-skeleton';
import type { DashboardData, BudgetStatus, Transaction } from '@/types';

const DashboardChart = dynamic(() => import('./dashboard-chart'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
});

const fmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });

const CATEGORY_CONFIGS: Record<string, { icon: any; bg: string; text: string }> = {
  Makanan: { icon: Utensils, bg: 'bg-amber-100/80 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400' },
  Transportasi: { icon: Car, bg: 'bg-blue-100/80 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
  Sewa: { icon: Home, bg: 'bg-purple-100/80 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400' },
  Pendidikan: { icon: GraduationCap, bg: 'bg-indigo-100/80 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400' },
  Hiburan: { icon: Gamepad2, bg: 'bg-rose-100/80 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400' },
  Belanja: { icon: ShoppingBag, bg: 'bg-pink-100/80 dark:bg-pink-950/30', text: 'text-pink-600 dark:text-pink-400' },
  Internet: { icon: Wifi, bg: 'bg-sky-100/80 dark:bg-sky-950/30', text: 'text-sky-600 dark:text-sky-400' },
  Gaji: { icon: Coins, bg: 'bg-emerald-100/80 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400' },
  Beasiswa: { icon: GraduationCap, bg: 'bg-teal-100/80 dark:bg-teal-950/30', text: 'text-teal-600 dark:text-teal-400' },
  'Pekerjaan Lepas': { icon: Laptop, bg: 'bg-green-100/80 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400' },
  'Dukungan Keluarga': { icon: Heart, bg: 'bg-red-100/80 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400' },
  Lainnya: { icon: HelpCircle, bg: 'bg-slate-100/80 dark:bg-slate-950/30', text: 'text-slate-600 dark:text-slate-400' },
};

const GOAL_ICONS: Record<string, any> = {
  '🏖️': Umbrella,
  '🚗': Car,
  '🏠': Home,
  '💻': Laptop,
  '🎓': GraduationCap,
  '💍': Heart,
  '👶': Baby,
  '🎉': PartyPopper,
  '🛡️': Shield,
  '📈': TrendingUp,
  '🎯': Target,
};

function statusVariant(status: BudgetStatus): 'success' | 'warning' | 'danger' {
  if (status === 'safe') return 'success';
  if (status === 'warning') return 'warning';
  return 'danger';
}

function statusLabel(status: BudgetStatus): string {
  if (status === 'safe') return 'Sesuai Jalur';
  if (status === 'warning') return 'Peringatan';
  if (status === 'critical') return 'Kritis';
  return 'Lebih Anggaran';
}



/* ─── Health Score Ring ─── */
function HealthScoreRing({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const label = score >= 70 ? 'Sangat Baik' : score >= 40 ? 'Cukup' : 'Perlu Perbaikan';

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="170" height="170" viewBox="0 0 160 160" className="drop-shadow-md select-none">
        <defs>
          <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="warningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={score >= 70 ? 'url(#healthGrad)' : 'url(#warningGrad)'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          className="transition-all duration-1000 ease-out"
        />
        <circle
          cx="80"
          cy="80"
          r={radius - 9}
          fill="#F8FAFC"
        />
        <text x="80" y="78" textAnchor="middle" className="text-4xl font-black tracking-tight" fill="#0F172A">
          {score}
        </text>
        <text x="80" y="102" textAnchor="middle" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </text>
      </svg>
    </div>
  );
}

/* ─── Savings Goal Mini Card ─── */
function SavingsGoalMini({ goal }: { goal: DashboardData['savingsGoals'][number] }) {
  const pct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
      <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="4" />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="#22C55E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 30 30)"
          className="transition-all duration-700 ease-out"
        />
        <text x="30" y="34" textAnchor="middle" className="text-[11px] font-semibold" fill="#0F172A">
          {pct}%
        </text>
      </svg>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 flex items-center gap-1.5">
          {(() => {
            const Icon = GOAL_ICONS[goal.icon] || Target;
            return <Icon className="h-4 w-4 text-slate-400 shrink-0" />;
          })()}
          {goal.goalName}
        </p>
        <p className="text-xs text-slate-500">
          {fmt.format(goal.currentAmount)} / {fmt.format(goal.targetAmount)}
        </p>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <ChartSkeleton />
        <CardSkeleton className="h-[380px]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <CardSkeleton className="h-[320px]" />
        <CardSkeleton className="h-[320px]" />
      </div>
    </div>
  );
}

/* ─── Welcome Empty State ─── */
function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/80 px-6 py-20 text-center backdrop-blur-sm animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
        <Wallet className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-slate-900">Selamat datang di BudgedIn! 🎓</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        Mulai atur keuangan Anda layaknya profesional. Tambahkan transaksi pertama Anda untuk melihat dasbor hidup dengan wawasan dan analitik.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/transactions">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Tambah Transaksi Pertama
          </Button>
        </Link>
        <Link href="/budgets">
          <Button variant="secondary">Atur Anggaran</Button>
        </Link>
        <Link href="/goals">
          <Button variant="ghost">Buat Target Tabungan</Button>
        </Link>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data: dashboardData, isPending, error } = useDashboard();

  const isEmpty = useMemo(() => {
    if (!dashboardData) return true;
    return (
      dashboardData.totalTransactions === 0 &&
      dashboardData.totalIncome === 0 &&
      dashboardData.totalExpenses === 0
    );
  }, [dashboardData]);

  if (isPending) return <DashboardSkeleton />;

  if (error || !dashboardData) {
    return <WelcomeState />;
  }

  if (isEmpty) {
    return <WelcomeState />;
  }

  const { currentBalance, totalIncome, totalExpenses, totalTransactions, recentTransactions, monthlyOverview, budgetOverview, savingsGoals, healthScore } = dashboardData;
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* ─── Stat Grid ─── */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-12">
        {/* Virtual Debit Card - Column span 5 on desktop, 12 on mobile/tablet */}
        <div className="md:col-span-12 xl:col-span-5 flex flex-col justify-between">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-tr from-emerald-950 via-emerald-800 to-teal-600 p-6 text-white shadow-soft border border-emerald-500/25 min-h-[210px] flex flex-col justify-between group animate-slide-up select-none">
            {/* Card background glowing orb */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />
            
            {/* Card Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

            {/* Top Section: Brand & Chip */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight">BudgedIn</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-[7px] font-black tracking-wider uppercase backdrop-blur-sm">PWA</span>
                </div>
                <p className="text-[8px] text-emerald-300/90 font-bold tracking-wider mt-0.5 uppercase">KARTU RENCANA MAHASISWA</p>
              </div>
              
              {/* Chip and Contactless Icons */}
              <div className="flex items-center gap-2">
                {/* Contactless Signal */}
                <svg className="h-4.5 w-4.5 text-emerald-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {/* Golden Chip */}
                <div className="h-7 w-9 rounded bg-gradient-to-br from-amber-350 via-yellow-400 to-amber-250 border border-amber-400/50 shadow-inner flex flex-col justify-between p-1.5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,rgba(0,0,0,0.1)_50%,transparent_55%)]" />
                  <div className="w-full h-px bg-amber-500/40" />
                  <div className="w-full h-px bg-amber-500/40" />
                </div>
              </div>
            </div>

            {/* Middle Section: Balance */}
            <div className="my-4 relative z-10">
              <p className="text-[9px] text-emerald-200/70 font-extrabold tracking-widest uppercase">SALDO AKTIF SAAT INI</p>
              <p className="text-3xl font-black mt-1 tracking-tight tabular-nums select-all drop-shadow-sm">
                {fmt.format(currentBalance)}
              </p>
            </div>

            {/* Bottom Section: Cardholder & Details */}
            <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-3">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-[7px] text-emerald-300/80 font-bold uppercase tracking-widest">PEMEGANG KARTU</p>
                <p className="text-xs font-bold truncate tracking-wide mt-0.5">
                  {user?.fullName ?? 'Mahasiswa BudgedIn'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[7px] text-emerald-300/80 font-bold uppercase tracking-widest">TIPE AKUN</p>
                <p className="text-[10px] font-bold text-emerald-100 tracking-wide mt-0.5">PREMIUM FREE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Pemasukan - Column span 4 on tablet, 2 on desktop */}
        <div className="md:col-span-4 xl:col-span-2 group relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 hover:shadow-glow hover:border-emerald-500/25 animate-slide-up delay-75">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500" />
          <div className="flex flex-col justify-between h-full min-h-[160px] md:min-h-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TOTAL PEMASUKAN</p>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 animate-count-up tabular-nums">
                  {fmt.format(totalIncome)}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Bulan Ini
            </div>
          </div>
        </div>

        {/* Total Pengeluaran - Column span 4 on tablet, 2 on desktop */}
        <div className="md:col-span-4 xl:col-span-2 group relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 hover:shadow-glow hover:border-red-500/25 animate-slide-up delay-150">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 to-rose-500" />
          <div className="flex flex-col justify-between h-full min-h-[160px] md:min-h-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TOTAL PENGELUARAN</p>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 animate-count-up tabular-nums">
                  {fmt.format(totalExpenses)}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Bulan Ini
            </div>
          </div>
        </div>

        {/* Transaksi - Column span 4 on tablet, 3 on desktop */}
        <div className="md:col-span-4 xl:col-span-3 group relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm transition-all duration-300 hover:shadow-glow hover:border-blue-500/25 animate-slide-up delay-225">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
          <div className="flex flex-col justify-between h-full min-h-[160px] md:min-h-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TRANSAKSI TERCATAT</p>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 animate-count-up tabular-nums">
                  {totalTransactions.toLocaleString()}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Riwayat Total
            </div>
          </div>
        </div>
      </section>

      {/* ─── Monthly Overview + Health Score ─── */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* Monthly Chart */}
        <Card className="animate-slide-up delay-150">
          <CardHeader>
            <CardTitle>Ringkasan Bulanan</CardTitle>
            <CardDescription>Tren pemasukan vs pengeluaran per bulan</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {monthlyOverview && monthlyOverview.length > 0 ? (
              <DashboardChart data={monthlyOverview} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Belum ada data bulanan
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="animate-slide-up delay-225">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Kesehatan Finansial
            </CardTitle>
            <CardDescription>Kedisiplinan anggaran dan konsistensi menabung Anda</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <HealthScoreRing score={healthScore} />
            <Badge variant={healthScore >= 70 ? 'success' : healthScore >= 40 ? 'warning' : 'danger'}>
              {healthScore >= 70 ? 'Sehat' : healthScore >= 40 ? 'Perlu Perbaikan' : 'Beresiko'}
            </Badge>
            <Link href="/reports" className="w-full">
              <Button variant="ghost" className="w-full mt-2">
                Lihat Laporan Lengkap <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* ─── Recent Transactions + Budget + Savings ─── */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Recent Transactions */}
        <Card className="animate-slide-up delay-225">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaksi Terakhir</CardTitle>
              <CardDescription>Aktivitas terbaru</CardDescription>
            </div>
            <Link href="/transactions">
              <Button variant="ghost" size="sm">
                Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 5).map((tx: Transaction) => {
                const config = CATEGORY_CONFIGS[tx.category] || CATEGORY_CONFIGS['Lainnya'];
                const Icon = config.icon;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100/80 bg-slate-50/40 px-4 py-3 transition-all duration-300 hover:bg-white hover:border-slate-200 hover:shadow-soft group/item"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 transition-transform duration-300 group-hover/item:translate-x-1">
                      <div className={cn('p-2.5 rounded-xl relative shrink-0 shadow-sm transition-all duration-300 group-hover/item:scale-110', config.bg, config.text)}>
                        <Icon className="h-4.5 w-4.5" />
                        <span className={cn(
                          "absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] text-white border-2 border-white font-black",
                          tx.type === 'income' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                        )}>
                          {tx.type === 'income' ? '+' : '-'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800 transition-colors group-hover/item:text-slate-900">{tx.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {tx.category} · {fmtDate(tx.transactionDate)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={cn(
                        'shrink-0 text-sm font-bold tracking-tight transition-transform duration-300 group-hover/item:-translate-x-1',
                        tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                      )}
                    >
                      {tx.type === 'income' ? '+' : '-'}{fmt.format(tx.amount)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Belum ada transaksi</p>
            )}
          </CardContent>
        </Card>

        {/* Budget Overview + Savings */}
        <div className="space-y-6">
          {/* Budget */}
          <Card className="animate-slide-up delay-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ikhtisar Anggaran</CardTitle>
                <CardDescription>Progres bulan ini</CardDescription>
              </div>
              <Link href="/budgets">
                <Button variant="ghost" size="sm">
                  Kelola <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {budgetOverview ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {fmt.format(budgetOverview.totalSpent)}
                        <span className="text-sm font-normal text-slate-500">
                          {' '}/ {fmt.format(budgetOverview.totalBudget)}
                        </span>
                      </p>
                    </div>
                    <Badge variant={statusVariant(budgetOverview.status)}>
                      {statusLabel(budgetOverview.status)}
                    </Badge>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100/80 border border-slate-200/30">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700 ease-out',
                        budgetOverview.status === 'safe' && 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
                        budgetOverview.status === 'warning' && 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
                        budgetOverview.status === 'critical' && 'bg-gradient-to-r from-red-400 to-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
                        budgetOverview.status === 'over_budget' && 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                      )}
                      style={{ width: `${Math.min(100, budgetOverview.percentageUsed)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-right">
                    {budgetOverview.percentageUsed.toFixed(1)}% terpakai · tersisa {fmt.format(budgetOverview.totalRemaining)}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-400 mb-3">Anggaran belum diatur untuk bulan ini</p>
                  <Link href="/budgets">
                    <Button size="sm">Buat Anggaran</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Goals */}
          <Card className="animate-slide-up delay-375">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Target Tabungan
                </CardTitle>
              </div>
              <Link href="/goals">
                <Button variant="ghost" size="sm">
                  Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {savingsGoals && savingsGoals.length > 0 ? (
                savingsGoals.slice(0, 3).map((goal) => (
                  <SavingsGoalMini key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-400 mb-3">Belum ada target tabungan</p>
                  <Link href="/goals">
                    <Button size="sm">Buat Target</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
