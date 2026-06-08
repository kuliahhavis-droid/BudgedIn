import { Router } from 'express';
import { reportController } from '../controllers/report.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
export const reportRouter = Router();
reportRouter.use(requireAuth);
reportRouter.get('/dashboard', reportController.dashboard);
reportRouter.get('/monthly', reportController.monthly);
reportRouter.get('/monthly.csv', reportController.csv);
// Alias so frontend /reports/export?format=csv also works
reportRouter.get('/export', reportController.csv);
