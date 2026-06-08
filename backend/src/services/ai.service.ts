import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { reportService } from './report.service.js';
import { prisma } from '../lib/prisma.js';

export interface ChatResponse {
  message: string;
  action: 'create_transaction' | 'none';
  transaction: {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    transactionDate: string; // YYYY-MM-DD
  } | null;
}

export const aiService = {
  async processChat(userId: string, userMessage: string): Promise<ChatResponse> {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di backend .env');
    }

    // 1. Ambil data profil pengguna
    const profile = await prisma.profile.findUnique({
      where: { id: userId }
    });
    const userName = profile?.fullName || 'Pengguna';

    // 2. Ambil konteks finansial pengguna dari dashboard report
    const now = new Date();
    const month = now.getUTCMonth() + 1;
    const year = now.getUTCFullYear();
    const financialContext = await reportService.dashboard(userId, month, year);

    // Format info detail anggaran
    let budgetInfo = 'Belum mengatur anggaran bulan ini.';
    if (financialContext.budgetOverview) {
      const bo = financialContext.budgetOverview;
      budgetInfo = `Total Anggaran: Rp ${bo.totalBudget.toLocaleString('id-ID')}, Terpakai: Rp ${bo.totalSpent.toLocaleString('id-ID')}, Tersisa: Rp ${bo.totalRemaining.toLocaleString('id-ID')} (Status: ${bo.status.replace('_', ' ')})`;
    }

    // Format riwayat transaksi terakhir
    const txList = financialContext.recentTransactions
      .map(t => `- [${t.type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}] ${t.title}: Rp ${Number(t.amount).toLocaleString('id-ID')} (${t.category})`)
      .slice(0, 5)
      .join('\n');

    // 3. Inisialisasi model Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    // 4. Susun System Prompt + Context
    const systemPrompt = `
      Kamu adalah "Asisten AI BudgedIn", asisten finansial mahasiswa yang ramah, santun, cerdas, dan suportif.
      Tugasmu adalah membantu pengguna (${userName}) melacak keuangan mereka, berkonsultasi seputar penghematan, dan membantu mencatat transaksi secara otomatis melalui percakapan.

      --- KONTEKS KEUANGAN PENGGUNA SAAT INI ---
      Nama Pengguna: ${userName}
      Saldo Aktif Saat Ini: Rp ${financialContext.currentBalance.toLocaleString('id-ID')}
      Pemasukan Bulan Ini: Rp ${financialContext.totalIncome.toLocaleString('id-ID')}
      Pengeluaran Bulan Ini: Rp ${financialContext.totalExpenses.toLocaleString('id-ID')}
      Skor Kesehatan Finansial: ${financialContext.healthScore}/100
      Status Anggaran Bulan Ini: ${budgetInfo}
      Riwayat 5 Transaksi Terakhir:
      ${txList || 'Belum ada transaksi.'}
      -----------------------------------------

      --- KATEGORI YANG VALID ---
      - Untuk Pengeluaran (expense): Makanan, Transportasi, Sewa, Pendidikan, Hiburan, Belanja, Internet, Lainnya
      - Untuk Pemasukan (income): Gaji, Beasiswa, Pekerjaan Lepas, Dukungan Keluarga, Lainnya
      ---------------------------

      --- INSTRUKSI RESPON ---
      Kamu harus mengembalikan respon dalam format JSON murni dengan skema berikut:
      {
        "message": "Kalimat balasan ramah untuk pengguna. Jika mencatat transaksi, jelaskan detail yang dicatat secara bersahabat.",
        "action": "create_transaction" ATAU "none",
        "transaction": {
          "title": "Judul transaksi (misal: 'Beli Bakso', 'Uang Saku')",
          "amount": 15000, (nominal dalam bentuk integer positif),
          "type": "expense" ATAU "income",
          "category": "Kategori yang paling cocok dari daftar Kategori Valid di atas",
          "transactionDate": "YYYY-MM-DD" (tanggal transaksi yang disebutkan, jika tidak disebutkan gunakan tanggal hari ini: ${now.toISOString().split('T')[0]})
        } ATAU null jika "action" bernilai "none"
      }

      Aturan Tambahan:
      1. Jika pengguna berniat mencatat transaksi (misal: "catat pengeluaran kopi 20rb", "tadi habis makan siang 15 ribu", "dapat beasiswa 1 juta"), set "action" ke "create_transaction", ekstrak detailnya, dan berikan balasan sukses yang ramah.
      2. Jika pengguna hanya bertanya (misal: "berapa sisa saldo saya?", "apakah kondisi keuangan saya aman?", "beri tips hemat anak kos"), set "action" ke "none", isi "transaction" dengan null, dan jawab pertanyaannya secara tepat berdasarkan KONTEKS KEUANGAN di atas.
      3. Jangan pernah mengembalikan teks markdown (seperti \`\`\`json). Kembalikan JSON murni. Jawab dalam Bahasa Indonesia yang kasual tapi sopan.
    `;

    const result = await model.generateContent([
      systemPrompt,
      `Pesan Pengguna: "${userMessage}"`
    ]);

    const text = result.response.text();
    if (!text) {
      throw new Error('AI tidak mengembalikan respon teks yang valid');
    }

    try {
      return JSON.parse(text.trim()) as ChatResponse;
    } catch (error) {
      console.error('Gagal memproses JSON dari Gemini Chat:', text);
      throw new Error('Gagal memproses respon percakapan dari AI');
    }
  }
};
