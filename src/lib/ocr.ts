import { createWorker } from 'tesseract.js';

export interface ExtractedReceiptData {
  merchantName: string;
  amount: number;
  transactionDate: string; // YYYY-MM-DD
  rawText: string;
}

/**
 * Melakukan pre-processing gambar menggunakan HTML5 Canvas.
 * Mengubah gambar menjadi grayscale dan meningkatkan kontrasnya.
 */
export async function preprocessImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal mendapatkan konteks 2D Canvas'));
          return;
        }

        // Tentukan resolusi optimal untuk OCR struk belanja
        // Jika terlalu besar, OCR berjalan sangat lambat. Optimal: lebar 800px-1000px
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Pemrosesan Piksel: Grayscale + Contrast Enhancement
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 1. Grayscale menggunakan standard ITU-R (Luminance)
          const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

          // 2. Thresholding / Contrast Enhancement sederhana
          let finalVal = grayscale;
          const threshold = 128;
          // Naikkan kontras: nilai mendekati putih ditarik ke putih, mendekati hitam ditarik ke hitam
          if (grayscale > threshold) {
            finalVal = Math.min(255, grayscale * 1.25);
          } else {
            finalVal = Math.max(0, grayscale * 0.75);
          }

          data[i] = finalVal;     // Red
          data[i + 1] = finalVal; // Green
          data[i + 2] = finalVal; // Blue
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar struk'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar'));
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Mengekstrak data dari teks struk menggunakan Regex dan pencarian pola.
 */
export function parseReceiptText(text: string): Omit<ExtractedReceiptData, 'rawText'> {
  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  
  // 1. Ekstraksi Nama Toko / Merchant
  // Mengambil baris non-kosong pertama yang biasanya adalah nama toko.
  let merchantName = 'Merchant Belanja';
  const filterKeywords = [/telp/i, /phone/i, /no\./i, /tgl/i, /tanggal/i, /^\d+$/, /===/, /---/, /jalan/i, /jl\./i];
  
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    const isInvalid = filterKeywords.some((regex) => regex.test(line));
    if (!isInvalid && line.length >= 3 && /[a-zA-Z]/.test(line)) {
      merchantName = line;
      break;
    }
  }

  // 2. Ekstraksi Tanggal Transaksi
  // Regex untuk mencocokkan format tanggal DD/MM/YYYY, DD-MM-YYYY, DD/MM/YY, DD-MM-YY, YYYY-MM-DD
  const dateRegex = /\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b|\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/;
  let transactionDate = new Date().toISOString().split('T')[0]; // Default hari ini

  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      if (match[1] && match[2] && match[3]) {
        // DD/MM/YYYY atau DD-MM-YYYY
        let day = parseInt(match[1]);
        let month = parseInt(match[2]) - 1; // 0-indexed di JS Date
        let yearStr = match[3];
        let year = parseInt(yearStr);
        if (yearStr.length === 2) {
          year += year >= 80 ? 1900 : 2000;
        }
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          transactionDate = parsedDate.toISOString().split('T')[0];
          break;
        }
      } else if (match[4] && match[5] && match[6]) {
        // YYYY-MM-DD
        const parsedDate = new Date(parseInt(match[4]), parseInt(match[5]) - 1, parseInt(match[6]));
        if (!isNaN(parsedDate.getTime())) {
          transactionDate = parsedDate.toISOString().split('T')[0];
          break;
        }
      }
    }
  }

  // 3. Ekstraksi Nominal / Total Harga
  // Mencari angka terbesar setelah kata kunci total, grand total, netto, atau rupiah.
  let amount = 0;
  let possibleAmounts: number[] = [];
  const totalKeywords = /total|grand|netto|jumlah|bayar|rp/i;
  
  lines.forEach((line) => {
    if (totalKeywords.test(line)) {
      // Bersihkan karakter simbol Rp dan whitespace
      const cleanedLine = line.replace(/rp/i, '').trim();
      const numbers = cleanedLine.match(/\b\d+([.,]\d+)*\b/g);
      if (numbers) {
        numbers.forEach((numStr) => {
          // Bersihkan titik ribuan atau koma ribuan
          const cleanedNum = numStr.replace(/[.,]/g, '');
          const parsed = parseFloat(cleanedNum);
          if (!isNaN(parsed) && parsed >= 100 && parsed < 10000000) {
            possibleAmounts.push(parsed);
          }
        });
      }
    }
  });

  if (possibleAmounts.length > 0) {
    amount = Math.max(...possibleAmounts);
  } else {
    // Jika tidak ada keyword total, kumpulkan semua angka dan ambil yang terbesar
    const allNumbers: number[] = [];
    lines.forEach((line) => {
      const cleaned = line.replace(/rp/i, '').trim();
      const matches = cleaned.match(/\b\d{1,3}([.,]\d{3})*(?![0-9])\b/g);
      if (matches) {
        matches.forEach((m) => {
          const val = parseFloat(m.replace(/[.,]/g, ''));
          if (!isNaN(val) && val >= 100 && val < 5000000) {
            allNumbers.push(val);
          }
        });
      }
    });

    if (allNumbers.length > 0) {
      amount = Math.max(...allNumbers);
    }
  }

  return {
    merchantName,
    amount,
    transactionDate,
  };
}

/**
 * Fungsi utama untuk memproses berkas gambar struk dan mengekstrak datanya.
 */
export async function scanReceipt(imageFile: File): Promise<ExtractedReceiptData> {
  const processedImageBase64 = await preprocessImage(imageFile);
  const worker = await createWorker('ind+eng');

  try {
    const { data: { text } } = await worker.recognize(processedImageBase64);
    const parsedData = parseReceiptText(text);

    return {
      ...parsedData,
      rawText: text,
    };
  } finally {
    await worker.terminate();
  }
}
