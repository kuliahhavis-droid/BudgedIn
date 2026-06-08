'use client'

import { useState } from 'react'
import {
  Plus, Pencil, Trash2, Target, CalendarDays, MoreVertical, Coins,
  Umbrella, Car, Home, Laptop, GraduationCap, Heart, Baby, PartyPopper, Shield, TrendingUp
} from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { format, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

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
}

import { useSavingsGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useContribute } from '@/hooks/use-goals'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const goalSchema = z.object({
  id: z.string().optional(),
  goalName: z.string().min(1, 'Nama wajib diisi'),
  description: z.string().optional(),
  targetAmount: z.coerce.number().positive(),
  targetDate: z.string().min(1, 'Tanggal target wajib diisi'),
  icon: z.string(),
})

type GoalFormValues = z.infer<typeof goalSchema>

const contributeSchema = z.object({
  amount: z.coerce.number().positive('Jumlah harus positif'),
  notes: z.string().optional(),
})

type ContributeFormValues = z.infer<typeof contributeSchema>

const ICONS = ['🏖️', '🚗', '🏠', '💻', '🎓', '💍', '👶', '🎉', '🛡️', '📈']

export function GoalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('active')

  const { data: goalsData, isPending } = useSavingsGoals()
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const deleteMutation = useDeleteGoal()
  const contributeMutation = useContribute()

  const goals = goalsData || []

  const activeGoals = goals.filter((g: any) => g.currentAmount < g.targetAmount)
  const completedGoals = goals.filter((g: any) => g.currentAmount >= g.targetAmount)

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goalName: '',
      description: '',
      targetAmount: 0,
      targetDate: '',
      icon: '🎯',
    },
  })

  const contributeForm = useForm<ContributeFormValues>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      amount: 0,
      notes: '',
    },
  })

  const handleOpenDialog = (goal?: any) => {
    if (goal) {
      setSelectedGoal(goal)
      form.reset({
        id: goal.id,
        goalName: goal.goalName,
        description: goal.description || '',
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate?.split('T')[0] || '',
        icon: goal.icon || '🎯',
      })
    } else {
      setSelectedGoal(null)
      form.reset({
        goalName: '',
        description: '',
        targetAmount: 0,
        targetDate: '',
        icon: '🎯',
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDelete = (goal: any) => {
    setSelectedGoal(goal)
    setIsDeleteDialogOpen(true)
  }

  const handleOpenContribute = (goal: any) => {
    setSelectedGoal(goal)
    contributeForm.reset({ amount: 0, notes: '' })
    setIsContributeDialogOpen(true)
  }

  const onSubmit = (data: GoalFormValues) => {
    if (selectedGoal) {
      const { id, ...updateData } = data;
      const goalId = id || selectedGoal.id;
      updateMutation.mutate({ id: goalId, data: updateData }, {
        onSuccess: () => {
          toast.success('Target diperbarui')
          setIsDialogOpen(false)
        },
      })
    } else {
      const { id, ...createData } = data;
      createMutation.mutate(createData, {
        onSuccess: () => {
          toast.success('Target dibuat')
          setIsDialogOpen(false)
        },
      })
    }
  }

  const onContribute = (data: ContributeFormValues) => {
    if (selectedGoal) {
      contributeMutation.mutate({ goalId: selectedGoal.id, ...data }, {
        onSuccess: () => {
          toast.success('Kontribusi berhasil ditambahkan')
          setIsContributeDialogOpen(false)
        },
      })
    }
  }

  const onDelete = () => {
    if (selectedGoal) {
      deleteMutation.mutate(selectedGoal.id, {
        onSuccess: () => {
          toast.success('Target dihapus')
          setIsDeleteDialogOpen(false)
        },
      })
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val || 0)

  const renderGoalCard = (goal: any) => {
    const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100 || 0, 100)
    const daysLeft = goal.targetDate ? differenceInDays(new Date(goal.targetDate), new Date()) : 0
    const isCompleted = percent >= 100

    return (
      <div key={goal.id} className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/50 flex flex-col relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              {(() => {
                const IconComponent = GOAL_ICONS[goal.icon] || Target
                return <IconComponent className="h-6 w-6" />
              })()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{goal.goalName}</h3>
              {goal.description && <p className="text-sm text-muted-foreground line-clamp-1">{goal.description}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuItem onClick={() => handleOpenDialog(goal)} className="rounded-xl cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 rounded-xl cursor-pointer focus:bg-red-50 focus:text-red-700" onClick={() => handleOpenDelete(goal)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4 my-4 flex-1">
          <div>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-bold">{formatCurrency(goal.currentAmount)}</div>
              <div className="text-sm text-muted-foreground pb-1">dari {formatCurrency(goal.targetAmount)}</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner relative">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  isCompleted ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${percent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                {percent.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 p-2 rounded-xl">
            <CalendarDays className="h-4 w-4" />
            <span>
              {goal.targetDate ? format(new Date(goal.targetDate), 'd MMM yyyy', { locale: id }) : 'Tanggal belum diatur'}
              {!isCompleted && daysLeft > 0 && ` • ${daysLeft} hari lagi`}
              {!isCompleted && daysLeft <= 0 && ' • Terlewat'}
            </span>
          </div>

          {!isCompleted && daysLeft > 0 && (
            <div className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/30 space-y-1">
              <p className="font-semibold text-slate-700">💡 Estimasi Rencana Tabungan:</p>
              <p className="leading-relaxed">
                Anda perlu menabung sekitar <span className="font-bold text-blue-600">{formatCurrency(Math.ceil((goal.targetAmount - goal.currentAmount) / daysLeft))}</span>/hari atau <span className="font-bold text-blue-600">{formatCurrency(Math.ceil((goal.targetAmount - goal.currentAmount) / (daysLeft / 7)))}</span>/minggu agar target tercapai tepat waktu.
              </p>
            </div>
          )}
        </div>

        {!isCompleted && (
          <Button
            className="w-full rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-0 mt-2"
            variant="outline"
            onClick={() => handleOpenContribute(goal)}
          >
            <Coins className="mr-2 h-4 w-4" /> Tambah Kontribusi
          </Button>
        )}
        {isCompleted && (
          <div className="w-full text-center py-2 bg-green-50 text-green-600 rounded-full text-sm font-semibold mt-2">
            Target Tercapai! 🎉
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Target Tabungan</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-soft">
          <Plus className="mr-2 h-4 w-4" /> Buat Target
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-full mb-6">
          <TabsTrigger value="active" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Aktif ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Selesai ({completedGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0 outline-none">
          {isPending ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
            </div>
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20">
              <Target className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">Belum ada target aktif</h3>
              <p className="text-muted-foreground mb-4">Mulai menabung untuk pembelian besar Anda berikutnya.</p>
              <Button onClick={() => handleOpenDialog()} variant="outline" className="rounded-full">
                Buat target
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeGoals.map(renderGoalCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0 outline-none">
          {completedGoals.length === 0 ? (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20">
              <Target className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4 opacity-50" />
              <h3 className="text-lg font-medium">Belum ada target yang selesai</h3>
              <p className="text-muted-foreground">Teruslah menabung untuk mencapai target Anda!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map(renderGoalCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Goal Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent maxWidth="md">
          <DialogHeader>
            <DialogTitle>{selectedGoal ? 'Edit Target' : 'Buat Target Baru'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-2">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Ikon</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="🏖️">🏖️ Liburan</option>
                          <option value="🚗">🚗 Kendaraan</option>
                          <option value="🏠">🏠 Rumah</option>
                          <option value="💻">💻 Gadget</option>
                          <option value="🎓">🎓 Pendidikan</option>
                          <option value="💍">💍 Pernikahan</option>
                          <option value="👶">👶 Anak</option>
                          <option value="🎉">🎉 Acara</option>
                          <option value="🛡️">🛡️ Dana Darurat</option>
                          <option value="📈">📈 Investasi</option>
                          <option value="🎯">🎯 Lainnya</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goalName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nama Target</FormLabel>
                      <FormControl>
                        <Input placeholder="mis. Mobil Baru" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Untuk apa Anda menabung?" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Target</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" className="rounded-xl font-semibold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Target</FormLabel>
                      <FormControl>
                        <Input type="date" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="px-0 pb-6 pt-4">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsDialogOpen(false)} disabled={createMutation.isPending || updateMutation.isPending}>
                  Batal
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white rounded-full" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan Target'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Contribute Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent maxWidth="sm">
          <DialogHeader>
            <DialogTitle>Tambah Kontribusi</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <h4 className="font-semibold text-lg">{selectedGoal?.goalName}</h4>
            <p className="text-sm text-muted-foreground">
              Progres saat ini: {formatCurrency(selectedGoal?.currentAmount || 0)} / {formatCurrency(selectedGoal?.targetAmount || 0)}
            </p>
          </div>
          <Form {...contributeForm}>
            <form onSubmit={contributeForm.handleSubmit(onContribute)} className="space-y-4 px-6 pb-2">
              <FormField
                control={contributeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Kontribusi</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="rounded-xl text-lg font-bold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contributeForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Bonus, sisa uang jajan, dll." className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="px-0 pb-6 pt-4">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsContributeDialogOpen(false)} disabled={contributeMutation.isPending}>
                  Batal
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full" disabled={contributeMutation.isPending}>
                  {contributeMutation.isPending ? 'Memproses...' : 'Tambah Dana'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent maxWidth="sm">
          <DialogHeader>
            <DialogTitle>Hapus Target</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground px-6 py-4">
            Apakah Anda yakin ingin menghapus "{selectedGoal?.goalName}"? Data progres yang tersimpan akan dihapus.
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
