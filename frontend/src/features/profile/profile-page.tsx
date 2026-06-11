'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Save, User as UserIcon, Lock, Upload, Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import { useAuthStore } from '@/stores/auth-store';
import { useUpdateProfile, useUploadAvatar, useResetData } from '@/hooks/use-profile';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
});

const passwordSchema = z.object({
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user: profile, resetPassword } = useAuthStore();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { mutate: resetData, isPending: isResetting } = useResetData();

  const handleResetData = () => {
    if (confirmText !== 'RESET DATA') return;
    resetData(undefined, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        setConfirmText('');
      }
    });
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
    },
    values: {
      fullName: profile?.fullName || '',
    }
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profil berhasil diperbarui');
      },
      onError: () => {
        toast.error('Gagal memperbarui profil');
      }
    });
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    try {
      if (profile?.email) {
        await resetPassword(profile.email);
        toast.success('Email reset kata sandi telah dikirim');
        passwordForm.reset();
      }
    } catch (error) {
      toast.error('Gagal mengirim reset kata sandi');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    try {
      await uploadAvatar(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-3xl shadow-soft">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              {!profile ? (
                <Skeleton className="h-24 w-24 rounded-full" />
              ) : (
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    <AvatarImage src={avatarPreview || profile?.avatarUrl || ''} />
                    <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700">
                      {getInitials(profile?.fullName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <Camera className="h-6 w-6" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                  />
                </div>
              )}
              
              <div className="mt-4 w-full">
                {!profile ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg">{profile?.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </>
                )}
              </div>

              {avatarFile && (
                <Button 
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600" 
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Unggah Gambar
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Umum</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
              <TabsTrigger value="danger">Zona Bahaya</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-4">
              <Card className="rounded-3xl shadow-soft">
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <UserIcon className="h-5 w-5 text-emerald-500" />
                      Informasi Pribadi
                    </CardTitle>
                    <CardDescription>
                      Perbarui detail pribadi Anda di sini.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama Lengkap</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...profileForm.register('fullName')}
                        className={profileForm.formState.errors.fullName ? "border-destructive" : ""}
                      />
                      {profileForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Alamat Email</Label>
                      <Input
                        id="email"
                        value={profile?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Alamat email tidak dapat diubah.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-emerald-500 hover:bg-emerald-600"
                      disabled={isUpdatingProfile || !profileForm.formState.isDirty}
                    >
                      {isUpdatingProfile ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Simpan Perubahan
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <Card className="rounded-3xl shadow-soft">
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Lock className="h-5 w-5 text-emerald-500" />
                      Atur Ulang Kata Sandi
                    </CardTitle>
                    <CardDescription>
                      Kirim email instruksi untuk mengubah kata sandi akun Anda.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Demi keamanan, kami akan mengirimkan link reset kata sandi ke email Anda ({profile?.email}). Silakan klik tombol di bawah untuk melanjutkan.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-emerald-500 hover:bg-emerald-600"
                      disabled={isChangingPassword || !profile?.email}
                    >
                      {isChangingPassword ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4" />
                      )}
                      Kirim Email Reset
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="danger" className="mt-4">
              <Card className="rounded-3xl shadow-soft border border-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Zona Bahaya
                  </CardTitle>
                  <CardDescription>
                    Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                    <h4 className="font-semibold text-red-800 text-sm mb-1">Mereset Data Keuangan</h4>
                    <p className="text-xs text-red-700 leading-relaxed">
                      Ini akan menghapus seluruh catatan transaksi keuangan Anda, setelan anggaran bulanan, target tabungan, dan semua notifikasi yang tersimpan di sistem kami.
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Akun profil Anda (Nama, Email, dan Kata Sandi) akan tetap dipertahankan sehingga Anda tidak perlu mendaftar ulang.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="danger"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset Semua Data Keuangan
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent maxWidth="md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Mereset Seluruh Data Keuangan?
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-slate-500">
              Tindakan ini akan menghapus semua riwayat transaksi, anggaran bulanan, target tabungan, dan notifikasi Anda secara **permanen** dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0 space-y-4">
            <p className="text-xs text-slate-600">
              Silakan ketik <span className="font-semibold text-slate-900 select-all">RESET DATA</span> di bawah ini untuk mengonfirmasi tindakan Anda:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="RESET DATA"
              className="border-slate-200 focus:border-red-500 focus:ring-red-200"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsConfirmOpen(false);
                setConfirmText('');
              }}
              disabled={isResetting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              disabled={confirmText !== 'RESET DATA' || isResetting}
              onClick={handleResetData}
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Hapus Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
