import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, TrendingUp, PieChart, ShieldCheck, Wallet } from 'lucide-react';

export function AuthShell({
  title,
  description,
  children,
  footer
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_40%,#F8FAFC_100%)] px-4 py-8 text-slate-900 flex items-center justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Left Column: Premium Value Proposition & Visuals */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 backdrop-blur px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <Wallet className="h-3.5 w-3.5" />
                </span>
                BudgedIn · Smart Personal Finance
              </Link>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-[1.15]">
                {title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-lg">
                {description}
              </p>
            </div>

            {/* Interactive Mockup Widget */}
            <div className="relative rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-xl backdrop-blur-sm max-w-md overflow-hidden group">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl transition-all group-hover:scale-125" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Limit Anggaran Bulanan</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <Sparkles className="h-3 w-3 animate-pulse text-emerald-600" />
                  AI-Optimized
                </span>
              </div>

              {/* Progress bar visual 1 */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>🍔 Makanan & Minuman</span>
                  <span>Rp 350.000 <span className="text-slate-400">/ Rp 500.000</span></span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Progress bar visual 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>📚 Pendidikan & Buku</span>
                  <span>Rp 120.000 <span className="text-slate-400">/ Rp 300.000</span></span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000" style={{ width: '40%' }} />
                </div>
              </div>

              {/* Floating micro stats */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Hemat <strong>15%</strong> dibanding bulan lalu</span>
                </div>
                <div className="font-semibold text-emerald-600">Skor: 88/100</div>
              </div>
            </div>

            {/* Core Value Props List */}
            <div className="space-y-4 max-w-lg">
              <div className="flex gap-3 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Pencatatan Otomatis dengan AI</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ketik pengeluaran secara kasual atau cukup foto struk belanja untuk diproses instan oleh Gemini AI.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <PieChart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Visualisasi Anggaran Pintar</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lacak dompet digital Anda dan dapatkan analisis mendalam mengenai pola pengeluaran bulanan.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Keamanan Data Terjamin</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Semua data keuangan Anda dienkripsi dengan aman untuk kenyamanan transaksi harian Anda.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="flex items-center justify-center w-full">
            <Card className="w-full max-w-md border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur rounded-3xl p-2.5">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">BudgedIn</CardTitle>
                <CardDescription className="text-slate-500">Manajemen keuangan cerdas mahasiswa</CardDescription>
              </CardHeader>
              <CardContent>
                {children}
                {footer ? <div className="mt-6 text-sm text-slate-500">{footer}</div> : null}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

