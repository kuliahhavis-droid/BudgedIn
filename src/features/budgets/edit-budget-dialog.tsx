'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateBudget } from '@/hooks/use-budgets';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Trash2, Plus,
  Utensils, Car, Home, GraduationCap, Gamepad2, ShoppingBag, Wifi, Coins, Laptop, Heart, HelpCircle
} from 'lucide-react';
import { BUDGET_CATEGORIES, Budget } from '@/types';

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

const formSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  totalBudget: z.coerce.number().min(1, 'Total budget harus lebih dari 0'),
  categories: z.array(
    z.object({
      category: z.string().min(1, 'Pilih kategori'),
      allocatedAmount: z.coerce.number().min(1, 'Alokasi harus lebih dari 0'),
    })
  ).min(1, 'Minimal satu kategori diperlukan')
  .refine((cats) => {
    const categoriesSet = new Set(cats.map(c => c.category));
    return categoriesSet.size === cats.length;
  }, { message: 'Kategori tidak boleh ada yang sama' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBudgetDialogProps {
  budget: Budget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({ budget, open, onOpenChange }: EditBudgetDialogProps) {
  const { mutateAsync: updateBudget, isPending } = useUpdateBudget();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalBudget: 0,
      categories: [{ category: '', allocatedAmount: 0 }],
    },
  });

  // Reset form when budget changes
  React.useEffect(() => {
    if (budget && open) {
      form.reset({
        month: budget.month,
        year: budget.year,
        totalBudget: Number(budget.totalBudget),
        categories: budget.categories.map((c: any) => ({
          category: c.category,
          allocatedAmount: Number(c.allocatedAmount),
        })),
      });
    }
  }, [budget, open, form]);

  const { fields, append, remove } = useFieldArray({
    name: 'categories',
    control: form.control,
  });

  const onSubmit = async (values: FormValues) => {
    if (!budget) return;
    try {
      await updateBudget({ id: budget.id, data: values });
      onOpenChange(false);
    } catch (error) {
      // Error handled by useUpdateBudget toast
    }
  };

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  if (!budget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="md">
        <DialogHeader>
          <DialogTitle>Edit Budget Bulanan</DialogTitle>
          <DialogDescription>
            Ubah batas pengeluaran atau alokasi kategori budget Anda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulan</FormLabel>
                    <Select value={String(field.value)} onValueChange={(val) => field.onChange(Number(val))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {months.map((m, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="totalBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget Keseluruhan</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Contoh: 5000000" {...field} />
                  </FormControl>
                  <FormDescription>Batas maksimal pengeluaran bulan ini</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold">Alokasi per Kategori</FormLabel>
                <Button type="button" variant="ghost" size="sm" onClick={() => append({ category: '', allocatedAmount: 0 })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kategori
                </Button>
              </div>

              {form.formState.errors.categories?.message && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.categories.message as string}
                </p>
              )}

              <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col sm:flex-row items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <FormField
                      control={form.control}
                      name={`categories.${index}.category`}
                      render={({ field: catField }) => (
                        <FormItem className="flex-1 w-full">
                          <Select value={catField.value} onValueChange={catField.onChange}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Pilih Kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUDGET_CATEGORIES.map((c) => {
                                const Icon = CATEGORY_ICONS[c] || HelpCircle;
                                return (
                                  <SelectItem key={c} value={c}>
                                    <span className="flex items-center gap-2">
                                      <Icon className="h-4 w-4 text-slate-400" />
                                      {c}
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-start gap-2 w-full sm:w-auto">
                      <FormField
                        control={form.control}
                        name={`categories.${index}.allocatedAmount`}
                        render={({ field: amtField }) => (
                          <FormItem className="flex-1 sm:w-32">
                            <FormControl>
                              <Input type="number" placeholder="Nominal" className="bg-white" {...amtField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          className="mt-0 h-11 w-11 p-0 shrink-0"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="px-0 pb-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isPending}>Batal</Button>
              </DialogClose>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
