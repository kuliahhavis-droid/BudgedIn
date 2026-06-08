import Link from 'next/link';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const featureHighlights = [
  {
    title: 'Lacak Setiap Rupiah',
    description: 'Catat pemasukan, pengeluaran, dan biaya rutin dalam hitungan detik dengan antarmuka yang bersih dan responsif.',
    icon: Wallet,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100/80 dark:bg-emerald-950/20 dark:border-emerald-900/30',
  },
  {
    title: 'Tetap Sesuai Anggaran',
    description: 'Kontrol anggaran bulanan dengan peringatan dini sebelum Anda melewati batas pengeluaran.',
    icon: ShieldCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100/80 dark:bg-amber-950/20 dark:border-amber-900/30',
  },
  {
    title: 'Bangun Kebiasaan Menabung',
    description: 'Tetapkan tujuan, lacak kontribusi, dan raih pencapaian setiap kali Anda mencapai target tabungan.',
    icon: Target,
    color: 'text-sky-600 bg-sky-50 border-sky-100/80 dark:bg-sky-950/20 dark:border-sky-900/30',
  },
  {
    title: 'Pahami Keuangan Anda',
    description: 'Grafik dan laporan yang menampilkan tren, kategori, serta kesehatan finansial tanpa informasi yang membingungkan.',
    icon: TrendingUp,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100/80 dark:bg-indigo-950/20 dark:border-indigo-900/30',
  }
];

const testimonials = [
  {
    name: 'Andi Wijaya',
    role: 'Mahasiswa Universitas Indonesia',
    text: 'BudgedIn sangat membantu mengatur uang saku bulanan. Sejak pakai ini, saya tidak pernah lagi kehabisan uang di akhir bulan!',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120',
  },
  {
    name: 'Siti Rahma',
    role: 'Mahasiswi Institut Teknologi Bandung',
    text: 'Suka sekali dengan fitur Target Tabungan. Sangat memotivasi untuk menyisihkan uang jajan demi beli laptop baru.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
  },
  {
    name: 'Rian Pratama',
    role: 'Mahasiswa Universitas Gadjah Mada',
    text: 'Tampilan grafiknya simpel banget. Skor kesehatan finansial membuat saya selalu tertantang menjaga pengeluaran tetap aman.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
  }
];

const steps = [
  {
    step: '01',
    title: 'Buat Akun Gratis',
    description: 'Daftar dalam waktu 30 detik menggunakan email kemahasiswaan Anda.',
  },
  {
    step: '02',
    title: 'Atur Anggaran Bulanan',
    description: 'Tentukan batas aman belanja per kategori seperti makanan, kos, dan transportasi.',
  },
  {
    step: '03',
    title: 'Lacak & Capai Target',
    description: 'Catat transaksi harian dengan mudah dan saksikan tabungan Anda berkembang.',
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50/90 text-slate-900 relative selection:bg-emerald-500 selection:text-white overflow-x-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-emerald-400/15 blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-400/15 blur-[100px] mix-blend-multiply animate-pulse delay-1000" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/10 blur-[110px] mix-blend-multiply animate-pulse delay-700" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 relative z-10">
        
        {/* Floating Glass Navigation Header */}
        <header className="sticky top-4 z-50 flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-6 py-3.5 shadow-soft backdrop-blur-md transition-all hover:bg-white/80 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden shadow-md shadow-emerald-500/10 border border-white">
              <img src="/logo.png" alt="BudgedIn Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-extrabold tracking-tight text-slate-800 leading-none">BudgedIn</p>
                <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-700 text-[8px] font-bold px-1.5 py-0 border-0 leading-none scale-90">PWA</Badge>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">Khusus Mahasiswa</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/login" className="rounded-full px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              Masuk
            </Link>
            <Button asChild className="rounded-full bg-slate-900 px-6 hover:bg-slate-800 text-white shadow-soft transition-all hover:scale-105 active:scale-95">
              <Link href="/register">Mulai Sekarang</Link>
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <Badge variant="success" className="mb-6 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} /> 
              Manajer Keuangan Pintar & Installable
            </Badge>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl/none leading-[1.05]">
              Atur uang kuliah <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">secara cerdas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 font-medium">
              Bebaskan diri dari stres finansial di akhir bulan. Catat pengeluaran rutin, buat batas anggaran per kategori, dan saksikan target tabungan Anda tercapai secara otomatis.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 px-8 hover:opacity-90 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 border-0">
                <Link href="/register" className="flex items-center gap-2 font-bold">
                  Mulai Pencatatan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-8 bg-white/80 border-slate-200 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-sm">
                <Link href="/login" className="font-semibold">Buka Dashboard</Link>
              </Button>
            </div>
            
            {/* Quick Stat Highlights */}
            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-200/60 pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">10k+</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Mahasiswa</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Rp2M+</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Telah Ditabung</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">98%</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Interactive CSS & SVG Dashboard Preview */}
          <div className="relative rounded-[36px] border border-white/60 bg-white/30 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
            <div className="absolute inset-0 -z-10 rounded-[36px] bg-gradient-to-b from-emerald-100/30 to-transparent" />
            <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl border border-slate-800/80 relative overflow-hidden">
              
              {/* Browser control header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">budgedin.app/dashboard</span>
              </div>
 
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SELAMAT DATANG</p>
                  <p className="text-base font-black text-white mt-0.5">Rian Pratama 👋</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Akun Terverifikasi
                </div>
              </div>

              {/* Virtual Debit Card Mockup */}
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-tr from-emerald-950 via-emerald-800 to-teal-600 p-5 text-white shadow-lg border border-emerald-500/25 min-h-[175px] flex flex-col justify-between group select-none mb-6">
                {/* Card background glowing orb */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
                
                {/* Card Texture Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03] pointer-events-none" />

                {/* Top Section: Brand & Chip */}
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold text-xs tracking-tight text-white">BudgedIn</span>
                      <span className="px-1 py-0.2 rounded bg-white/20 text-[6px] font-black tracking-wider uppercase backdrop-blur-sm">PWA</span>
                    </div>
                    <p className="text-[7px] text-emerald-300 font-semibold tracking-wider uppercase mt-0.5">KARTU RENCANA MAHASISWA</p>
                  </div>
                  
                  {/* Chip and Contactless Icons */}
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-emerald-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="h-5.5 w-7 rounded bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-200 border border-amber-400/30 flex flex-col justify-between p-1 overflow-hidden relative">
                      <div className="w-full h-px bg-amber-500/40" />
                      <div className="w-full h-px bg-amber-500/40" />
                    </div>
                  </div>
                </div>

                {/* Middle Section: Balance */}
                <div className="my-2.5 relative z-10">
                  <p className="text-[8px] text-emerald-200/60 font-bold tracking-widest uppercase">SALDO AKTIF SAAT INI</p>
                  <p className="text-2xl font-black tracking-tight mt-0.5">Rp 4.250.000</p>
                </div>

                {/* Bottom Section: Cardholder & Details */}
                <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-2.5">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-[6px] text-emerald-300/80 font-bold uppercase tracking-widest leading-none">PEMEGANG KARTU</p>
                    <p className="text-[10px] font-bold truncate tracking-wide mt-0.5 leading-none">Rian Pratama</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[6px] text-emerald-300/80 font-bold uppercase tracking-widest leading-none">TIPE AKUN</p>
                    <p className="text-[8px] font-bold text-emerald-100 tracking-wide mt-0.5 leading-none">PREMIUM FREE</p>
                  </div>
                </div>
              </div>

              {/* Grid content inside mockup dashboard */}
              <div className="grid gap-4 grid-cols-2">
                
                {/* Financial Health Index */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">SKOR FINANSIAL</p>
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                    </div>
                    <p className="text-4xl font-black text-emerald-400 mt-2">86<span className="text-xs text-slate-600 font-normal">/100</span></p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-800/60 pt-2 font-medium">
                    Kategori keuangan: <span className="text-emerald-400 font-bold">SEHAT</span>
                  </div>
                </div>

                {/* Savings Target Mini Card */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TARGET TABUNGAN</p>
                      <Target className="h-3.5 w-3.5 text-sky-400" />
                    </div>
                    <p className="text-xs font-bold truncate mt-2">💻 Laptop Kuliah</p>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-[8px] text-slate-500 mb-1">
                      <span>Progres 68%</span>
                      <span>Rp5.4M / Rp8M</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic SVG Spline Chart Preview */}
              <div className="mt-4 bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80">
                <p className="text-[9px] font-bold text-slate-400 mb-3 uppercase tracking-wider">TREN KAS BULANAN</p>
                <div className="h-28 w-full relative">
                  <svg viewBox="0 0 400 120" className="w-full h-full">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="70" x2="400" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    {/* Line Path */}
                    <path d="M 0 100 Q 50 60 100 80 T 200 30 T 300 60 T 400 20" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 0 100 Q 50 60 100 80 T 200 30 T 300 60 T 400 20 L 400 120 L 0 120 Z" fill="url(#chart-grad)" />
                    {/* Active Point */}
                    <circle cx="200" cy="30" r="5" fill="#10B981" stroke="#020617" strokeWidth="2" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="py-20 md:py-28 border-t border-slate-200/60">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Kenapa Mahasiswa Memilih BudgedIn?
            </h2>
            <p className="mt-4 text-slate-500 font-medium leading-relaxed">
              Didesain khusus untuk pola hidup mahasiswa. Lacak keuangan, kendalikan anggaran bulanan, dan capai impian Anda tanpa kerumitan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Bento Card 1: Lacak Setiap Rupiah */}
            <div className="md:col-span-2 group overflow-hidden rounded-[32px] border border-slate-200 bg-white/50 p-8 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-emerald-500/25 flex flex-col sm:flex-row justify-between gap-6 items-center">
              <div className="max-w-sm">
                <div className="mb-5 inline-flex rounded-2xl p-3 border shadow-sm transition-all duration-300 group-hover:scale-110 text-emerald-600 bg-emerald-50 border-emerald-100/80 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-emerald-700 transition-colors">
                  Lacak Setiap Rupiah
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                  Catat pemasukan, pengeluaran jajan, dan biaya kuliah dalam hitungan detik. Antarmuka yang bersih dan dioptimalkan penuh untuk kecepatan akses.
                </p>
              </div>

              {/* Transaction Micro-mockup */}
              <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl text-xs space-y-3 w-full max-w-[250px] shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-extrabold text-[9px] text-slate-500 uppercase tracking-widest">Catatan Kilat</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-300">🍔 Kantin Kampus</span>
                    <span className="text-rose-400 font-bold">-Rp 15.000</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-300">💸 Kiriman Bulanan</span>
                    <span className="text-emerald-400 font-bold">+Rp 1.500.000</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-300">🚌 TransJakarta</span>
                    <span className="text-rose-400 font-bold">-Rp 3.500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Tetap Sesuai Anggaran */}
            <div className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white/50 p-8 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-emerald-500/25 flex flex-col justify-between gap-6">
              <div>
                <div className="mb-5 inline-flex rounded-2xl p-3 border shadow-sm transition-all duration-300 group-hover:scale-110 text-amber-600 bg-amber-50 border-amber-100/80 dark:bg-amber-950/20 dark:border-amber-900/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                  Tetap Sesuai Anggaran
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                  Atur batasan belanja bulanan per kategori dan terima notifikasi peringatan sebelum Anda melewati batas aman.
                </p>
              </div>

              {/* Budget Micro-mockup */}
              <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl text-xs space-y-3 w-full transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[9px] text-slate-500 uppercase tracking-widest">Kategori Makanan</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[8px] font-extrabold uppercase tracking-wide">Kritis (85%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                  <span>Tersisa Rp75.000</span>
                  <span>Batas Rp500.000</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Bangun Kebiasaan Menabung */}
            <div className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white/50 p-8 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-emerald-500/25 flex flex-col justify-between gap-6">
              <div>
                <div className="mb-5 inline-flex rounded-2xl p-3 border shadow-sm transition-all duration-300 group-hover:scale-110 text-sky-600 bg-sky-50 border-sky-100/80 dark:bg-sky-950/20 dark:border-sky-900/30">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-sky-600 transition-colors">
                  Kebiasaan Menabung
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                  Miliki target impian (gadget, liburan, magang) dan biarkan sistem menghitung rencana kontribusi harian/mingguan yang realistis.
                </p>
              </div>

              {/* Savings Goal Micro-mockup */}
              <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl text-xs space-y-3.5 w-full transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">💻</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-[11px] text-white truncate">Laptop Kuliah</p>
                    <p className="text-[9px] text-slate-500 font-medium">Target Rp8.000.000</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                    <span>Terkumpul 68%</span>
                    <span>Rp5.440.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Pahami Keuangan Anda */}
            <div className="md:col-span-2 group overflow-hidden rounded-[32px] border border-slate-200 bg-white/50 p-8 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-emerald-500/25 flex flex-col sm:flex-row justify-between gap-6 items-center">
              <div className="max-w-sm">
                <div className="mb-5 inline-flex rounded-2xl p-3 border shadow-sm transition-all duration-300 group-hover:scale-110 text-indigo-600 bg-indigo-50 border-indigo-100/80 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-indigo-700 transition-colors">
                  Analisis Finansial Cerdas
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                  Grafik analitik dan skor kesehatan finansial yang dihitung berdasarkan kedisiplinan berbelanja serta konsistensi tabungan Anda.
                </p>
              </div>

              {/* Chart Micro-mockup */}
              <div className="bg-slate-950 text-white p-5 rounded-3xl border border-slate-800 shadow-2xl text-xs space-y-3.5 w-full max-w-[250px] shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[9px] text-slate-500 uppercase tracking-widest">Tren Kas Kampus</span>
                  <span className="text-[9px] text-emerald-400 font-bold">+18.5%</span>
                </div>
                <div className="h-16 w-full relative">
                  <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="bento-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 50 Q 40 42 80 46 T 160 20 T 200 12 L 200 60 L 0 60 Z" fill="url(#bento-grad)" />
                    <path d="M 0 50 Q 40 42 80 46 T 160 20 T 200 12" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="200" cy="12" r="3.5" fill="#10B981" stroke="#020617" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Stepper */}
        <section className="py-20 md:py-28 bg-slate-950 text-white rounded-[48px] px-6 md:px-12 my-8 relative overflow-hidden shadow-2xl border border-slate-900">
          <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[90px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-[80px]" />
          
          <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Tiga Langkah Sederhana untuk Mulai
            </h2>
            <p className="mt-4 text-slate-400 font-medium">
              Tidak membutuhkan sinkronisasi bank yang ribet. BudgedIn menjaga privasi dan keamanan data finansial Anda sepenuhnya.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {steps.map((item) => (
              <div key={item.step} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 relative group transition-all duration-300 hover:border-emerald-500/20">
                <div className="text-6xl font-black text-emerald-500/10 mb-4 group-hover:text-emerald-500/30 transition-colors duration-300 leading-none">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Ulasan Teman Mahasiswa
            </h2>
            <p className="mt-4 text-slate-500 font-medium">
              Bagaimana rekan-rekan mahasiswa menyehatkan finansial mereka dan meraih target impian dengan BudgedIn.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-slate-200/60 bg-white/70 shadow-soft relative transition-all duration-300 hover:shadow-md backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed italic mb-6 font-medium">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shadow-sm bg-slate-100" />
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-400 font-semibold">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Premium Mesh Gradient CTA Banner */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-[48px] shadow-xl relative overflow-hidden mb-12 border border-emerald-400/25">
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute right-[-5%] top-[-5%] w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto px-6 relative z-10">
            <Badge className="bg-white/20 text-white border-0 px-4 py-1 mb-6 rounded-full text-xs font-semibold backdrop-blur-sm">
              ✨ 100% Gratis & Bebas Iklan Selamanya
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Siap Mengatur Keuangan Lebih Cermat?
            </h2>
            <p className="mt-4 text-emerald-50 max-w-lg mx-auto text-base leading-relaxed font-medium">
              Bergabunglah bersama ribuan mahasiswa hebat lainnya untuk wujudkan finansial yang stabil dan teratur.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="rounded-full bg-white text-emerald-700 hover:bg-slate-50 font-bold px-8 shadow-lg transition-all hover:scale-105 active:scale-95 border-0">
                <Link href="/register">Buat Akun Gratis</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200/60 pt-8 pb-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-white">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">BudgedIn</span>
            <span>•  Manajemen Keuangan Mahasiswa</span>
          </div>
          <p>© {new Date().getFullYear()} BudgedIn. Dibuat dengan penuh dedikasi untuk menyukseskan mahasiswa.</p>
        </footer>

      </div>
    </main>
  );
}
