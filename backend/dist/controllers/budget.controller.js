import { budgetService } from '../services/budget.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { budgetQuerySchema, budgetSchema, updateBudgetSchema } from '../validators/budget.validator.js';
import { idParamSchema } from '../validators/common.validator.js';
export const budgetController = {
    list: asyncHandler(async (req, res) => {
        res.json({ success: true, data: await budgetService.list(req.user.id, budgetQuerySchema.parse(req.query)) });
    }),
    upsert: asyncHandler(async (req, res) => {
        const budget = await budgetService.upsert(req.user.id, budgetSchema.parse(req.body));
        await budgetService.evaluateNotifications(req.user.id, budget.month, budget.year);
        res.status(201).json({ success: true, data: budget });
    }),
    update: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json({ success: true, data: await budgetService.update(req.user.id, id, updateBudgetSchema.parse(req.body)) });
    }),
    delete: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json({ success: true, data: await budgetService.delete(req.user.id, id) });
    })
};
