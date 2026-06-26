'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { format, subMonths } from 'date-fns';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Download,
  FileText,
  PieChart as PieChartIcon,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useReports } from '@/hooks/use-reports';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';



const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const COLORS = ['#22C55E', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const IncomeExpenseBarChart = dynamic(() => import('./reports-charts').then(mod => mod.IncomeExpenseBarChart), { 
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
});
const CategoryPieChart = dynamic(() => import('./reports-charts').then(mod => mod.CategoryPieChart), { 
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
});
const TrendsLineChart = dynamic(() => import('./reports-charts').then(mod => mod.TrendsLineChart), { 
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
});

export function ReportsPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const { monthlyReport: report, isLoading: isReportPending } = useReports(month, year);

  // Build chart data from monthly report
  const trends = report?.byCategory
    ? [{ month: format(new Date(year, month - 1, 1), 'MMM'), income: report.totalIncome, expense: report.totalExpense }]
    : [];

  const categories = report?.byCategory
    ? report.byCategory.map((c: any, i: number) => ({
        name: c.category,
        value: c.expense || 0,
        color: COLORS[i % COLORS.length],
      }))
    : [];

  const isTrendsPending = isReportPending;
  const isCategoriesPending = isReportPending;

  const handleExportCSV = async () => {
    try {
      // Mock CSV generation
      const csvContent = "Date,Category,Amount,Type\n2023-10-01,Food,50,Expense\n";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `budgedin-report-${year}-${month}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor CSV');
    }
  };

  const handleExportPDF = () => {
    try {
      window.print();
      toast.success('Dialog cetak dibuka');
    } catch (error) {
      toast.error('Gagal membuka dialog cetak');
    }
  };

  const years = Array.from({ length: 5 }).map((_, i) => currentDate.getFullYear() - i);
  const months = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: format(new Date(2000, i, 1), 'MMMM'),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h1>
          <p className="text-muted-foreground">Dapatkan wawasan tentang kebiasaan finansial Anda.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Ekspor PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-3xl shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isReportPending ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(report?.totalIncome || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {isReportPending ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <div className="text-2xl font-bold text-rose-600">
                {formatCurrency(report?.totalExpense || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tabungan Bersih</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isReportPending ? (
              <Skeleton className="h-8 w-[120px]" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(report?.savings || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl shadow-soft bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-50">Performa Anggaran</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-50" />
          </CardHeader>
          <CardContent>
            {isReportPending ? (
              <Skeleton className="h-8 w-[120px] bg-emerald-400/50" />
            ) : (
              <div className="text-2xl font-bold">
                {report?.budgetPerformance || 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl shadow-soft col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-emerald-500" />
              Pemasukan vs Pengeluaran
            </CardTitle>
            <CardDescription>Perbandingan untuk bulan yang dipilih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isReportPending ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <IncomeExpenseBarChart data={[
                  { name: 'Pemasukan', value: report?.totalIncome || 0, fill: '#22C55E' },
                  { name: 'Pengeluaran', value: report?.totalExpense || 0, fill: '#ef4444' }
                ]} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-soft col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-emerald-500" />
              Rincian Kategori
            </CardTitle>
            <CardDescription>Distribusi pengeluaran untuk bulan yang dipilih</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isCategoriesPending ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : categories?.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Tidak ada data pengeluaran bulan ini
                </div>
              ) : (
                <CategoryPieChart data={categories} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-soft md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Tren Bulanan
            </CardTitle>
            <CardDescription>Tren pemasukan dan pengeluaran untuk tahun {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {isTrendsPending ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <TrendsLineChart data={trends} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
