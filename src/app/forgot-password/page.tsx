'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthShell } from '../../components/layout/auth-shell';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../stores/auth-store';

const forgotSchema = z.object({
  email: z.string().email('Masukkan alamat email yang valid'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
      setIsSuccess(true);
      toast.success('Email atur ulang kata sandi berhasil dikirim');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengirim email reset';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Lupa Kata Sandi | BudgedIn</title>
      <AuthShell
        title="Atur ulang kata sandi"
        description="Masukkan alamat email Anda dan kami akan mengirimkan link untuk mengatur ulang kata sandi Anda."
        footer={
          <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke halaman masuk
          </Link>
        }
      >
      {isSuccess ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Periksa email Anda</h3>
            <p className="mt-2 text-sm text-slate-500">
              Kami telah mengirimkan link atur ulang kata sandi ke alamat email Anda. Silakan periksa kotak masuk dan folder spam Anda.
            </p>
          </div>
          <Link href="/login">
            <Button variant="ghost">Kembali ke halaman masuk</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nama@universitas.ac.id"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim link reset'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
    </>
  );
}
