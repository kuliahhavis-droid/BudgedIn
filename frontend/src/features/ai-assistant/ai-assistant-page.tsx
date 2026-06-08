'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  transaction?: any;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

export function AiAssistantPage() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya adalah Asisten AI BudgedIn. Saya bisa membantu kamu mencatat pemasukan dan pengeluaran secara otomatis dari percakapan kita, atau memberikan tips hemat keuangan anak kos.\n\nCobalah ketik sesuatu seperti:\n• *"Catat beli bensin 15.000 tadi siang"*\n• *"Saya baru dapat beasiswa 1.500.000"*\n• *"Berapa sisa anggaran dan saldo saya bulan ini?"*',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-emerald-500 animate-pulse" />
          Asisten AI BudgedIn
        </h1>
        <p className="text-muted-foreground text-sm">
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
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatMutation.isPending ? 'Asisten sedang mengetik...' : 'Ketik pengeluaran/tanya sesuatu...'}
              disabled={chatMutation.isPending}
              className="flex-1 bg-white border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 shadow-inner"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending}
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
