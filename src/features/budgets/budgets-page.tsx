'use client';

import * as React from 'react';
import { useState } from 'react';
import { useBudgets, useDeleteBudget } from '@/hooks/use-budgets';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '@/components/ui/button';
import {
  Plus, Wallet, AlertCircle, MoreVertical, Edit2, Trash2,
  Utensils, Car, Home, GraduationCap, Gamepad2, ShoppingBag, Wifi, Coins, Laptop, Heart, HelpCircle
} from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { CreateBudgetDialog } from './create-budget-dialog';
import { EditBudgetDialog } from './edit-budget-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const CATEGORY_ICONS: Record<string, any> = {
  Makanan: Utensils,
  Transportasi: Car,
  Sewa: Home,
  Pendidikan: GraduationCap,
  Hiburan: Gamepad2,
  Belanja: ShoppingBag,
  Internet: Wifi,
  Gaji: Coins,
  Beasiswa: GraduationCap,
  'Pekerjaan Lepas': Laptop,
  'Dukungan Keluarga': Heart,
  Lainnya: HelpCircle,
};

const getMonthName = (month: number) => {
  return new Date(2000, month - 1, 1).toLocaleString('id-ID', { month: 'long' });
};

const getStatusColor = (percentage: number) => {
  if (percentage > 100) return 'text-red-600 bg-red-100';
  if (percentage >= 81) return 'text-orange-600 bg-orange-100';
  if (percentage >= 51) return 'text-yellow-600 bg-yellow-100';
  return 'text-emerald-600 bg-emerald-100';
};

const getStatusLabel = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'safe') return 'Aman';
  if (s === 'warning') return 'Peringatan';
  if (s === 'critical') return 'Kritis';
  if (s === 'over budget' || s === 'over_budget') return 'Lebih Anggaran';
  return status;
};

const getProgressColor = (percentage: number) => {
  if (percentage > 100) return 'bg-red-500';
  if (percentage >= 81) return 'bg-orange-500';
  if (percentage >= 51) return 'bg-yellow-500';
  return 'bg-emerald-500';
};

export function BudgetsPage() {
  const { data: budgets, isLoading, error } = useBudgets();
  const { mutate: deleteBudget } = useDeleteBudget();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);

  const handleCreateBudget = () => {
    setIsCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader title="Anggaran" description="Mengelola batas pengeluaran bulanan Anda." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <PageHeader title="Anggaran" />
        <EmptyState
          icon={<AlertCircle className="h-8 w-8 text-red-500" />}
          title="Gagal Memuat Data"
          description="Terjadi kesalahan saat memuat data budget Anda."
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in fade-in duration-500">
        <PageHeader
          title="Anggaran"
          description="Pantau dan kelola batas pengeluaran Anda setiap bulan."
          action={
            <Button onClick={handleCreateBudget} className="rounded-xl shadow-sm hover:shadow transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Budget
            </Button>
          }
        />

        {(!budgets || budgets.length === 0) ? (
          <EmptyState
            icon={<Wallet className="h-8 w-8" />}
            title="Belum ada budget"
            description="Anda belum membuat budget untuk bulan apapun. Buat budget pertama Anda untuk mulai mengontrol pengeluaran!"
            action={{ label: 'Buat Budget', onClick: handleCreateBudget }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget: any) => {
              const used = budget.used ?? budget.totalSpent ?? 0;
              const remaining = budget.remaining ?? budget.totalRemaining ?? 0;
              const percentageUsed = budget.percentageUsed ?? 0;
              const status = budget.status ?? 'Safe';

              return (
                <Card key={budget.id} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-slate-800">
                        {getMonthName(budget.month)} {budget.year}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" className={getStatusColor(percentageUsed)}>
                          {getStatusLabel(status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingBudget(budget)}>
                              <Edit2 className="h-4 w-4" />
                              Edit Budget
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeletingBudget(budget)}
                              className="text-red-600 focus:bg-red-50 focus:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus Budget
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Terpakai</span>
                        <span className="font-medium text-slate-700">
                          <CurrencyDisplay amount={used} />
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentageUsed, 100)} 
                        className="h-2.5 bg-slate-100" 
                        indicatorClassName={getProgressColor(percentageUsed)} 
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Dari total</span>
                        <span className="text-slate-700 font-medium">
                          <CurrencyDisplay amount={Number(budget.totalBudget)} />
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Kategori
                      </h4>
                      <div className="space-y-3">
                        {budget.categories?.map((cat: any) => {
                          const catUsed = cat.used ?? cat.spentAmount ?? 0;
                          const catPct = cat.percentageUsed ?? (Number(cat.allocatedAmount) > 0 ? (catUsed / Number(cat.allocatedAmount)) * 100 : 0);
                          const Icon = CATEGORY_ICONS[cat.category] || HelpCircle;
                          return (
                            <div key={cat.id} className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 flex items-center gap-1.5">
                                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                                  {cat.category}
                                </span>
                                <span className="text-slate-900 font-medium">
                                  <CurrencyDisplay amount={catUsed} /> <span className="text-slate-400 font-normal">/ <CurrencyDisplay amount={Number(cat.allocatedAmount)} /></span>
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(catPct, 100)} 
                                className="h-1.5 bg-slate-100"
                                indicatorClassName={getProgressColor(catPct)} 
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <CreateBudgetDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      
      <EditBudgetDialog 
        budget={editingBudget} 
        open={!!editingBudget} 
        onOpenChange={(open) => !open && setEditingBudget(null)} 
      />

      <ConfirmDialog
        open={!!deletingBudget}
        onOpenChange={(open) => !open && setDeletingBudget(null)}
        title="Hapus Budget?"
        description={`Apakah Anda yakin ingin menghapus budget untuk bulan ${deletingBudget ? getMonthName(deletingBudget.month) : ''} ${deletingBudget?.year}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Budget"
        variant="danger"
        onConfirm={() => {
          if (deletingBudget) deleteBudget(deletingBudget.id);
        }}
      />
    </>
  );
}
