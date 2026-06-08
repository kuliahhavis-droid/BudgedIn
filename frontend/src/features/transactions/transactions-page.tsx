'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Search, Filter, Pencil, Trash2, ArrowUpRight, ArrowDownRight, MoreVertical,
  Utensils, Car, Home, GraduationCap, Gamepad2, ShoppingBag, Wifi, Coins, Laptop, Heart, HelpCircle, Download,
  Camera, Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/hooks/use-transactions'
import { cn } from '@/lib/utils'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

const transactionSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Jumlah harus positif'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Kategori wajib diisi'),
  transactionDate: z.string().min(1, 'Tanggal wajib diisi'),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

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
}

export function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  const filters = {
    search: debouncedSearch || undefined,
    type: typeFilter !== 'all' ? (typeFilter as 'income' | 'expense') : undefined,
  }

  const { data: transactionsData, isPending, isFetching } = useTransactions(filters)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const transactions = transactionsData?.items ?? transactionsData ?? []

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0],
    },
  })

  const selectedType = watch('type')

  const [isScanning, setIsScanning] = useState(false)
  const [isScanningAI, setIsScanningAI] = useState(false)

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    const toastId = toast.loading('Sedang memproses struk belanja Anda...')

    try {
      const { scanReceipt } = await import('@/lib/ocr')
      const data = await scanReceipt(file)

      setValue('title', data.merchantName)
      setValue('amount', data.amount)
      setValue('transactionDate', data.transactionDate)

      toast.success('Struk berhasil dipindai! Silakan tinjau data.', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Gagal memproses struk. Silakan isi manual.', { id: toastId })
    } finally {
      setIsScanning(false)
      e.target.value = ''
    }
  }

  const handleAIScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Buka dialog tambah transaksi & set loading scanning
    setSelectedId(null)
    reset({
      title: '',
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0],
    })
    setIsDialogOpen(true)
    setIsScanningAI(true)

    const toastId = toast.loading('Mengonversi gambar struk...')

    try {
      // Baca file ke Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
      })

      toast.loading('Menganalisis struk dengan Gemini AI...', { id: toastId })

      const { apiPost } = await import('@/services/api')
      const response = await apiPost<{
        merchantName: string;
        amount: number;
        transactionDate: string;
        type: 'income' | 'expense';
        category: string;
      }>('/transactions/scan-receipt', { image: base64Data })

      if (response.success && response.data) {
        const { merchantName, amount, transactionDate, type, category } = response.data
        setValue('title', merchantName)
        setValue('amount', amount)
        setValue('transactionDate', transactionDate)
        setValue('type', type)
        setValue('category', category)
        toast.success('Pindai Gemini AI sukses! Silakan tinjau data.', { id: toastId })
      } else {
        toast.error('Gagal mengekstrak data dari AI.', { id: toastId })
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Gagal terhubung dengan server AI.', { id: toastId })
    } finally {
      setIsScanningAI(false)
      e.target.value = ''
    }
  }

  const handleOpenCreate = () => {
    setSelectedId(null)
    reset({
      title: '',
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
      transactionDate: new Date().toISOString().split('T')[0],
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (tx: any) => {
    setSelectedId(tx.id)
    reset({
      title: tx.title,
      description: tx.description || '',
      amount: Number(tx.amount),
      type: tx.type,
      category: tx.category,
      transactionDate: tx.transactionDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    })
    setIsDialogOpen(true)
  }

  const handleOpenDelete = (tx: any) => {
    setSelectedId(tx.id)
    setSelectedTitle(tx.title)
    setIsDeleteDialogOpen(true)
  }

  const onSubmit = (data: TransactionFormValues) => {
    if (selectedId) {
      updateMutation.mutate(
        { id: selectedId, data },
        { onSuccess: () => setIsDialogOpen(false) }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsDialogOpen(false),
      })
    }
  }

  const onDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId, {
        onSuccess: () => setIsDeleteDialogOpen(false),
      })
    }
  }

  const handleExportCSV = () => {
    try {
      if (transactions.length === 0) {
        toast.error('Tidak ada transaksi untuk diekspor');
        return;
      }
      const headers = ['Tanggal', 'Judul', 'Tipe', 'Kategori', 'Jumlah', 'Catatan'];
      const rows = (transactions as any[]).map(tx => [
        tx.transactionDate ? format(new Date(tx.transactionDate), 'yyyy-MM-dd') : '',
        tx.title,
        tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        tx.category,
        tx.amount,
        tx.description || ''
      ]);
      const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `budgedin-transaksi-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      toast.success('Transaksi sukses diekspor ke CSV');
    } catch (e) {
      toast.error('Gagal mengekspor CSV');
    }
  };

  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV} className="rounded-full shadow-soft flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" /> Ekspor CSV
          </Button>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="ai-receipt-upload"
            onChange={handleAIScanReceipt}
            disabled={isScanningAI}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('ai-receipt-upload')?.click()}
            className="rounded-full shadow-soft flex-1 sm:flex-initial border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
            disabled={isScanningAI}
          >
            {isScanningAI ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-emerald-500" />
                Memindai...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4 text-emerald-500" />
                Scan dengan AI
              </>
            )}
          </Button>

          <Button onClick={handleOpenCreate} className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-soft flex-1 sm:flex-initial">
            <Plus className="mr-2 h-4 w-4" /> Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-white/20">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
            className="pl-9 rounded-full bg-white/80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px] rounded-full bg-white/80">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isPending ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Transaksi tidak ditemukan</h3>
          <p className="text-muted-foreground">Sesuaikan filter Anda atau tambahkan transaksi baru.</p>
        </div>
      ) : (
        <div className={cn(
          "bg-white rounded-3xl shadow-sm border overflow-x-auto transition-all duration-300",
          isFetching && "opacity-60 saturate-50 pointer-events-none"
        )}>
          <div className="divide-y min-w-[600px] md:min-w-0">
            {(transactions as any[]).map((tx) => {
              const config = CATEGORY_CONFIGS[tx.category] || CATEGORY_CONFIGS['Lainnya']
              const Icon = config.icon
              return (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl flex-shrink-0 relative",
                      config.bg, config.text
                    )}>
                      <Icon className="h-5 w-5" />
                      <span className={cn(
                        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white border border-white font-bold",
                        tx.type === 'income' ? "bg-green-500" : "bg-red-500"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {tx.title}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.transactionDate ? format(new Date(tx.transactionDate), 'd MMM yyyy', { locale: id }) : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "font-semibold text-right",
                      tx.type === 'income' ? "text-green-600" : "text-gray-900"
                    )}>
                      <div>{tx.type === 'income' ? '+' : '-'}{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(tx.amount))}</div>
                      <div className="text-xs font-normal opacity-70 capitalize">{tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 h-8 w-8" onClick={() => handleOpenEdit(tx)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 text-red-500 h-8 w-8" onClick={() => handleOpenDelete(tx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent maxWidth="md">
          {/* Gemini AI Scanning Glassmorphism Overlay */}
          {isScanningAI && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 rounded-3xl animate-fade-in select-none">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 relative overflow-hidden shadow-inner">
                {/* Glowing ring */}
                <div className="absolute inset-0 border-2 border-emerald-500 rounded-3xl animate-ping opacity-45" />
                <Camera className="h-9 w-9 animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">Gemini AI Sedang Memindai...</h4>
                <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
                  Kami sedang mengekstrak nama merchant, total nominal, tanggal, dan kategori dari struk Anda secara otomatis.
                </p>
              </div>
              {/* Animated laser line */}
              <div className="w-[80%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent relative overflow-hidden mt-2">
                <div className="absolute inset-0 bg-emerald-400 w-1/3 animate-shimmer animate-pulse" />
              </div>
            </div>
          )}

          <DialogHeader>
            <DialogTitle>{selectedId ? 'Edit Transaksi' : 'Tambah Transaksi'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-2">
            {/* Scan Receipt Section */}
            {!selectedId && (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-xs text-muted-foreground">Malas mengetik? Pindai struk/nota belanja Anda secara lokal.</p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  id="receipt-upload"
                  onChange={handleScanReceipt}
                  disabled={isScanning}
                />
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "rounded-full bg-white dark:bg-slate-950 shadow-sm border border-slate-200",
                    isScanning && "opacity-70 pointer-events-none"
                  )}
                  disabled={isScanning}
                  onClick={() => document.getElementById('receipt-upload')?.click()}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-500" />
                      Memindai Struk...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4 text-green-500" />
                      Pindai Struk / Nota
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Judul</label>
              <Input placeholder="mis. Belanja bulanan" className="rounded-xl" {...register('title')} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tipe</label>
                <Select
                  value={selectedType}
                  onValueChange={(val) => {
                    setValue('type', val as 'income' | 'expense')
                    setValue('category', '')
                  }}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Jumlah</label>
                <Input type="number" step="0.01" min="0" className="rounded-xl" {...register('amount')} />
                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Kategori</label>
                <Select value={watch('category')} onValueChange={(val) => setValue('category', val)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const Icon = CATEGORY_CONFIGS[cat]?.icon || HelpCircle;
                      return (
                        <SelectItem key={cat} value={cat}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-400" />
                            {cat}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Tanggal</label>
                <Input type="date" className="rounded-xl" {...register('transactionDate')} />
                {errors.transactionDate && <p className="text-xs text-red-500 mt-1">{errors.transactionDate.message}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Catatan (opsional)</label>
              <Input placeholder="Detail tambahan..." className="rounded-xl" {...register('description')} />
            </div>

            <DialogFooter className="px-0 pb-6 pt-2">
              <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsDialogOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
                Batal
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent maxWidth="sm">
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground px-6 py-4">
            Apakah Anda yakin ingin menghapus <strong>&quot;{selectedTitle}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
              Batal
            </Button>
            <Button type="button" variant="destructive" className="rounded-full" onClick={onDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
