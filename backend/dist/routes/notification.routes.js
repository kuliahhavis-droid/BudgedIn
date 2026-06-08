import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
export const notificationRouter = Router();
notificationRouter.use(requireAuth);
notificationRouter.get('/stream', notificationController.stream);
notificationRouter.get('/', notificationController.list);
notificationRouter.patch('/read-all', notificationController.markAllRead);
notificationRouter.patch('/:id/read', notificationController.markRead);
