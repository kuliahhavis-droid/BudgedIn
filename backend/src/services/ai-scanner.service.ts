import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

export const aiScannerService = {
  async scanReceipt(base64ImageWithHeader: string) {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi di backend .env');
    }

    // Pisahkan header base64 jika ada (e.g. data:image/jpeg;base64,...)
    let mimeType = 'image/jpeg';
    let base64Data = base64ImageWithHeader;

    if (base64ImageWithHeader.includes(';base64,')) {
      const parts = base64ImageWithHeader.split(';base64,');
      mimeType = parts[0].replace('data:', '');
      base64Data = parts[1];
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Gunakan model gemini-1.5-flash yang sangat responsif dan cost-effective
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
      Kamu adalah AI scanner struk belanja yang andal untuk aplikasi keuangan mahasiswa bernama "BudgedIn".
      Analisis gambar struk belanja berikut dengan teliti dan ekstrak informasi berikut ke dalam format JSON murni:
      
      {
        "merchantName": "Nama Toko atau Merchant (string, bersihkan nama agar rapi, misal: Indomaret, Alfamart, Starbucks)",
        "amount": 50000, (nominal total belanja/pembayaran, integer positif saja, tanpa koma desimal, tanpa desimal sen),
        "transactionDate": "YYYY-MM-DD", (tanggal transaksi dari struk, format ISO YYYY-MM-DD),
        "type": "expense", (tipe transaksi, selalu bernilai "expense" untuk struk belanja/nota pengeluaran),
        "category": "Kategori yang paling cocok berdasarkan barang belanjaan. Pilih salah satu dari daftar ini saja: Makanan, Transportasi, Sewa, Pendidikan, Hiburan, Belanja, Internet, Gaji, Beasiswa, Pekerjaan Lepas, Dukungan Keluarga, Lainnya."
      }

      Pastikan respons yang kamu kembalikan adalah format JSON yang valid, tanpa ada teks penjelasan tambahan atau pembungkus kode markdown (seperti \`\`\`json).
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const text = result.response.text();
    if (!text) {
      throw new Error('AI tidak mengembalikan respon teks yang valid');
    }

    try {
      return JSON.parse(text.trim());
    } catch (error) {
      console.error('Gagal memproses JSON dari Gemini:', text);
      throw new Error('Gagal memproses struktur data dari respon AI');
    }
  }
};
