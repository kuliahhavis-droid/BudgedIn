'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowRightLeft, Camera, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateTransaction } from '@/hooks/use-transactions';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  transaction?: any;
  isInteractiveScan?: boolean;
  scanData?: {
    merchantName: string;
    amount: number;
    transactionDate: string;
    type: 'income' | 'expense';
    category: string;
  };
  isSaved?: boolean;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

// Sub-component for interactive verification of receipt data
interface InteractiveScanCardProps {
  initialData: {
    merchantName: string;
    amount: number;
    transactionDate: string;
    type: 'income' | 'expense';
    category: string;
  };
  onSaveSuccess: (transaction: any) => void;
  onCancel: () => void;
}

function InteractiveScanCard({ initialData, onSaveSuccess, onCancel }: InteractiveScanCardProps) {
  const [title, setTitle] = useState(initialData.merchantName || '');
  const [amount, setAmount] = useState(initialData.amount || 0);
  const [transactionDate, setTransactionDate] = useState(initialData.transactionDate || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>(initialData.type || 'expense');
  const [category, setCategory] = useState(initialData.category || '');
  const [description, setDescription] = useState('');
  
  const createMutation = useCreateTransaction();
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Judul wajib diisi');
      return;
    }
    if (amount <= 0) {
      toast.error('Jumlah harus positif');
      return;
    }
    if (!category) {
      toast.error('Kategori wajib diisi');
      return;
    }
    if (!transactionDate) {
      toast.error('Tanggal wajib diisi');
      return;
    }

    createMutation.mutate({
      title,
      amount,
      transactionDate,
      type,
      category,
      description,
    }, {
      onSuccess: (data) => {
        onSaveSuccess(data);
      }
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 mt-2 text-slate-800 dark:text-slate-200 shadow-inner w-full max-w-sm">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 dark:border-slate-800/60 pb-1 flex items-center justify-between">
        <span>Tinjau Hasil Scan Struk</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-2.5 text-xs">
        {/* Title */}
        <div>
          <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Judul / Merchant</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="h-8 text-xs rounded-lg bg-white" 
            placeholder="Nama Toko/Judul" 
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Type */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tipe</label>
            <Select
              value={type}
              onValueChange={(val: 'income' | 'expense') => {
                setType(val);
                setCategory(''); 
              }}
            >
              <SelectTrigger className="h-8 text-xs rounded-lg bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="text-xs">Pemasukan</SelectItem>
                <SelectItem value="expense" className="text-xs">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Jumlah (Rp)</label>
            <Input 
              type="number" 
              value={amount || ''} 
              onChange={(e) => setAmount(Number(e.target.value))} 
              className="h-8 text-xs rounded-lg bg-white" 
              placeholder="Jumlah" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Category */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Kategori</label>
            <Select value={category} onValueChange={(val) => setCategory(val)}>
              <SelectTrigger className="h-8 text-xs rounded-lg bg-white">
                <SelectValue placeholder="Pilih..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Tanggal</label>
            <Input 
              type="date" 
              value={transactionDate} 
              onChange={(e) => setTransactionDate(e.target.value)} 
              className="h-8 text-xs rounded-lg bg-white px-2" 
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Catatan (opsional)</label>
          <Input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="h-8 text-xs rounded-lg bg-white" 
            placeholder="Detail tambahan..." 
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="h-7 text-[10px] rounded-full px-3"
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Batal
        </Button>
        <Button 
          type="button" 
          size="sm" 
          className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3"
          onClick={handleSave}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Transaksi'
          )}
        </Button>
      </div>
    </div>
  );
}

export function AiAssistantPage() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya adalah Asisten AI BudgedIn. Saya bisa membantu kamu mencatat pemasukan dan pengeluaran secara otomatis dari percakapan kita, atau memberikan tips hemat keuangan anak kos.\n\nCobalah ketik sesuatu seperti:\n• *"Catat beli bensin 15.000 tadi siang"*\n• *"Saya baru dapat beasiswa 1.500.000"*\n• *"Berapa sisa anggaran dan saldo saya bulan ini?"*\n\nKamu juga bisa mengunggah atau memotret struk belanja secara langsung lewat ikon Kamera di sebelah kolom ketikan untuk ditinjau.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    // Add temporary message
    const userMsgId = Math.random().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: '📸 Mengirim struk belanja untuk dipindai...',
        timestamp: new Date(),
      },
    ]);

    const toastId = toast.loading('Sedang memproses struk belanja Anda...');

    try {
      // 1. Convert to Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });

      toast.loading('Menganalisis struk dengan Gemini AI...', { id: toastId });

      // 2. Call backend apiPost
      const { apiPost } = await import('@/services/api');
      const response = await apiPost<{
        merchantName: string;
        amount: number;
        transactionDate: string;
        type: 'income' | 'expense';
        category: string;
      }>('/transactions/scan-receipt', { image: base64Data });

      if (response.success && response.data) {
        toast.success('Pindai struk berhasil! Silakan tinjau data di bawah ini.', { id: toastId });
        
        // 3. Add bot message with interactive scan card
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Saya telah selesai memindai struk belanja kamu menggunakan Gemini AI. Silakan tinjau data transaksi di bawah ini sebelum menyimpannya agar data tetap valid.',
            timestamp: new Date(),
            isInteractiveScan: true,
            scanData: response.data,
          },
        ]);
      } else {
        toast.error('Gagal mengekstrak data dari AI.', { id: toastId });
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'bot',
            text: 'Maaf, saya gagal membaca data dari struk tersebut. Coba pastikan gambar struk Anda cukup terang dan jelas!',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Gagal terhubung dengan server AI.', { id: toastId });
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Terjadi kesalahan sistem saat mencoba memindai struk. Silakan coba lagi nanti!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsScanning(false);
      e.target.value = '';
    }
  };

  // Menggunakan mutation React Query untuk mengirim chat ke backend
  const chatMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const { apiPost } = await import('@/services/api');
      const response = await apiPost<{
        message: string;
        action: 'create_transaction' | 'none';
        transaction: any;
      }>('/ai/chat', { message: messageText });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Gagal memproses obrolan');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Tambahkan respon bot ke daftar pesan
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: data.message,
          timestamp: new Date(),
          transaction: data.transaction,
        },
      ]);

      // Jika ada transaksi yang berhasil dibuat, segarkan dasbor & daftar transaksi
      if (data.action === 'create_transaction' && data.transaction) {
        toast.success(`Transaksi "${data.transaction.title}" berhasil dicatat!`);
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Terjadi kesalahan sistem');
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: 'Maaf, saya sedang mengalami kendala jaringan untuk terhubung ke otak AI saya. Silakan coba sesaat lagi!',
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || chatMutation.isPending) return;

    // 1. Tambahkan pesan user ke UI
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: trimmed,
        timestamp: new Date(),
      },
    ]);

    setInput('');

    // 2. Kirim pesan ke API Backend
    chatMutation.mutate(trimmed);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const quickPrompts = [
    'Catat makan siang bakso 15 ribu',
    'Dapat kiriman bulanan dari ortu 1 juta',
    'Berapa sisa anggaran dan saldo saya?',
    'Beri tips hemat belanja mingguan',
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-185px)] md:h-[calc(100vh-120px)] max-h-[800px] gap-3 md:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
          <Sparkles className="h-6 w-6 sm:h-7 sm:h-7 text-emerald-500 animate-pulse" />
          Asisten AI BudgedIn
        </h1>
        <p className="hidden sm:block text-muted-foreground text-sm">
          Konsultasi keuangan dan catat transaksi cerdas secara langsung lewat chat.
        </p>
      </div>

      {/* Main Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 shadow-soft bg-white/50 backdrop-blur-sm relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex items-start gap-3 max-w-[85%] md:max-w-[75%]',
                  isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm border',
                    isBot
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20'
                      : 'bg-primary/5 border-primary/10 text-primary'
                  )}
                >
                  {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm border',
                      isBot
                        ? 'bg-white text-slate-800 border-slate-100'
                        : 'bg-emerald-600 text-white border-emerald-500 font-medium'
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Attachment Transaction Success Card */}
                  {msg.transaction && (
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800 animate-fade-in shadow-inner">
                      <div className="flex items-center gap-2.5">
                        <ArrowRightLeft className="h-4.5 w-4.5 text-emerald-600" />
                        <div>
                          <p className="font-bold">{msg.transaction.title}</p>
                          <p className="opacity-80">
                            {msg.transaction.category} · {new Date(msg.transaction.transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-black text-emerald-700">
                        {msg.transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(msg.transaction.amount))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Scan Review Card */}
                  {msg.isInteractiveScan && msg.scanData && !msg.isSaved && (
                    <InteractiveScanCard
                      initialData={msg.scanData}
                      onSaveSuccess={(createdTx) => {
                        setMessages((prev) =>
                          prev.map((m) =>
                            m.id === msg.id
                              ? {
                                  ...m,
                                  isSaved: true,
                                  transaction: createdTx,
                                  text: 'Transaksi berhasil disimpan setelah ditinjau dan divalidasi oleh Anda.',
                                }
                              : m
                          )
                        );
                        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                        queryClient.invalidateQueries({ queryKey: ['transactions'] });
                      }}
                      onCancel={() => {
                        setMessages((prev) =>
                          prev.map((m) =>
                            m.id === msg.id
                              ? {
                                  ...m,
                                  isInteractiveScan: false,
                                  text: 'Pindai struk dibatalkan.',
                                }
                              : m
                          )
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {chatMutation.isPending && (
            <div className="flex items-start gap-3 mr-auto max-w-[75%] animate-pulse">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length === 1 && !chatMutation.isPending && (
          <div className="px-4 md:px-6 py-2 shrink-0 flex flex-wrap gap-2 animate-fade-in">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 relative"
          >
            {/* Input file upload (hidden) */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              id="ai-receipt-upload"
              onChange={handleScanReceipt}
              disabled={isScanning}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('ai-receipt-upload')?.click()}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-xl h-9 w-9 text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
              disabled={isScanning || chatMutation.isPending}
            >
              {isScanning ? (
                <Loader2 className="h-4.5 w-4.5 text-emerald-500 animate-spin" />
              ) : (
                <Camera className="h-4.5 w-4.5" />
              )}
            </Button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isScanning ? 'Memindai struk...' : chatMutation.isPending ? 'Asisten sedang mengetik...' : 'Ketik pengeluaran atau unggah struk...'}
              disabled={chatMutation.isPending || isScanning}
              className="flex-1 bg-white border border-slate-200 rounded-2xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 shadow-inner"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending || isScanning}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
