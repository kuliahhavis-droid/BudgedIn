import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const profileRouter = Router();
profileRouter.use(requireAuth);
profileRouter.get('/me', profileController.me);
profileRouter.get('/avatar-upload-url', profileController.avatarUploadUrl);
profileRouter.put('/me', profileController.upsert);
profileRouter.patch('/me', profileController.update);
profileRouter.delete('/reset-data', profileController.resetData);


