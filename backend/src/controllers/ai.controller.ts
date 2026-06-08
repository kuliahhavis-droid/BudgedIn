import { aiService } from '../services/ai.service.js';
import { transactionService } from '../services/transaction.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const aiController = {
  chat: asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Pesan obrolan (message) wajib disertakan' });
    }

    const userId = req.user!.id;
    
    // 1. Proses pesan menggunakan Gemini AI
    const result = await aiService.processChat(userId, message);

    let createdTransaction = null;

    // 2. Jika AI mendeteksi intensi mencatat transaksi, eksekusi pembuatan transaksi di DB
    if (result.action === 'create_transaction' && result.transaction) {
      try {
        const tx = result.transaction;
        // Panggil transaction service untuk membuat transaksi baru
        createdTransaction = await transactionService.create(userId, {
          title: tx.title,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          transactionDate: new Date(tx.transactionDate),
          description: `Dicatat otomatis via Asisten AI`
        });
      } catch (dbError: any) {
        console.error('Gagal mencatat transaksi otomatis via Chat AI:', dbError);
        // Ubah pesan agar memberitahu pengguna ada kegagalan teknis
        result.message = `Maaf, saya mendeteksi Anda ingin mencatat "${result.transaction.title}" sebesar Rp ${result.transaction.amount.toLocaleString('id-ID')}, namun terjadi kesalahan saat menyimpannya ke database.`;
        result.action = 'none';
      }
    }

    res.json({
      success: true,
      data: {
        message: result.message,
        action: result.action,
        transaction: createdTransaction
      }
    });
  })
};
