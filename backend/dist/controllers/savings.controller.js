import { savingsService } from '../services/savings.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { idParamSchema } from '../validators/common.validator.js';
import { contributionSchema, savingsGoalSchema, updateSavingsGoalSchema } from '../validators/savings.validator.js';
export const savingsController = {
    list: asyncHandler(async (req, res) => {
        res.json({ success: true, data: await savingsService.list(req.user.id) });
    }),
    create: asyncHandler(async (req, res) => {
        res.status(201).json({ success: true, data: await savingsService.create(req.user.id, savingsGoalSchema.parse(req.body)) });
    }),
    update: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json({ success: true, data: await savingsService.update(req.user.id, id, updateSavingsGoalSchema.parse(req.body)) });
    }),
    delete: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json({ success: true, data: await savingsService.delete(req.user.id, id) });
    }),
    contribute: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.status(201).json({ success: true, data: await savingsService.contribute(req.user.id, id, contributionSchema.parse(req.body)) });
    })
};
