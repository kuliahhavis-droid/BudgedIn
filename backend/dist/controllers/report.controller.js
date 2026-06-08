import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { z } from 'zod';
const reportQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).default(new Date().getUTCMonth() + 1),
    year: z.coerce.number().int().min(2020).max(2100).default(new Date().getUTCFullYear())
});
export const reportController = {
    dashboard: asyncHandler(async (req, res) => {
        const { month, year } = reportQuerySchema.parse(req.query);
        res.json({ success: true, data: await reportService.dashboard(req.user.id, month, year) });
    }),
    monthly: asyncHandler(async (req, res) => {
        const { month, year } = reportQuerySchema.parse(req.query);
        res.json({ success: true, data: await reportService.monthly(req.user.id, month, year) });
    }),
    csv: asyncHandler(async (req, res) => {
        const { month, year } = reportQuerySchema.parse(req.query);
        const report = await reportService.monthly(req.user.id, month, year);
        const rows = ['date,title,type,category,amount', ...report.transactions.map((item) => [item.transactionDate.toISOString(), item.title, item.type, item.category, item.amount].join(','))];
        res.header('Content-Type', 'text/csv').attachment(`budgedin-${year}-${month}.csv`).send(rows.join('\n'));
    })
};
