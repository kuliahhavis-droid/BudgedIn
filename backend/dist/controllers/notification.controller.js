import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { idParamSchema } from '../validators/common.validator.js';
import { eventBus } from '../lib/events.js';
export const notificationController = {
    list: asyncHandler(async (req, res) => {
        res.json({ success: true, data: await notificationService.list(req.user.id) });
    }),
    markRead: asyncHandler(async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json({ success: true, data: await notificationService.markRead(req.user.id, id) });
    }),
    markAllRead: asyncHandler(async (req, res) => {
        res.json({ success: true, data: await notificationService.markAllRead(req.user.id) });
    }),
    stream: (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });
        req.socket.setTimeout(0);
        req.socket.setKeepAlive(true);
        req.socket.setNoDelay(true);
        // Send an initial heartbeat to establish the connection
        res.write(':\n\n');
        const userId = req.user.id;
        const listener = (eventData) => {
            res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        };
        eventBus.on(`user:${userId}`, listener);
        // Keep connection alive with heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
            res.write(':\n\n');
        }, 30000);
        req.on('close', () => {
            clearInterval(heartbeat);
            eventBus.off(`user:${userId}`, listener);
        });
    }
};
