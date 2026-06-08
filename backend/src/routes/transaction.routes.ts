import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const transactionRouter = Router();
transactionRouter.use(requireAuth);
transactionRouter.get('/', transactionController.list);
transactionRouter.post('/', transactionController.create);
transactionRouter.post('/scan-receipt', transactionController.scanReceipt);
transactionRouter.patch('/:id', transactionController.update);
transactionRouter.delete('/:id', transactionController.delete);

