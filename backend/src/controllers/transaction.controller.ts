import { asyncHandler } from '../utils/async-handler.js';
import { idParamSchema } from '../validators/common.validator.js';
import { transactionQuerySchema, transactionSchema, updateTransactionSchema } from '../validators/transaction.validator.js';
import { transactionService } from '../services/transaction.service.js';
import { aiScannerService } from '../services/ai-scanner.service.js';

export const transactionController = {
  list: asyncHandler(async (req, res) => {
    res.json({ success: true, data: await transactionService.list(req.user!.id, transactionQuerySchema.parse(req.query)) });
  }),
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await transactionService.create(req.user!.id, transactionSchema.parse(req.body)) });
  }),
  update: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    res.json({ success: true, data: await transactionService.update(req.user!.id, id, updateTransactionSchema.parse(req.body)) });
  }),
  delete: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    res.json({ success: true, data: await transactionService.delete(req.user!.id, id) });
  }),
  scanReceipt: asyncHandler(async (req, res) => {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ success: false, error: 'Data gambar Base64 wajib disertakan' });
      return;
    }
    try {
      const data = await aiScannerService.scanReceipt(image);
      res.json({ success: true, data });
    } catch (scanError: any) {
      console.error('Gemini Scan Receipt Error:', scanError);
      let friendlyMessage = scanError.message || 'Gagal memindai struk belanja';
      if (friendlyMessage.includes('leaked') || friendlyMessage.includes('API key') || friendlyMessage.includes('API_KEY')) {
        friendlyMessage = 'Gagal memproses struk dengan Gemini AI karena API Key backend terdeteksi tidak valid atau bocor/diblokir.';
      }
      res.status(400).json({ success: false, message: friendlyMessage });
    }
  })
};

