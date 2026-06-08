import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const aiRouter = Router();

aiRouter.use(requireAuth);
aiRouter.post('/chat', aiController.chat);
