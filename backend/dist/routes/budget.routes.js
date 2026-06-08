import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
export const budgetRouter = Router();
budgetRouter.use(requireAuth);
budgetRouter.get('/', budgetController.list);
budgetRouter.post('/', budgetController.upsert);
budgetRouter.patch('/:id', budgetController.update);
budgetRouter.delete('/:id', budgetController.delete);
