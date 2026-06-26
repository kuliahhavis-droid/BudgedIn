import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/backend/lib/auth-helper';
import { ZodError } from 'zod';
import { HttpError } from '@/backend/utils/http-error';
import { transactionService } from '@/backend/services/transaction.service';
import { budgetService } from '@/backend/services/budget.service';
import { savingsService } from '@/backend/services/savings.service';
import { notificationService } from '@/backend/services/notification.service';
import { profileService } from '@/backend/services/profile.service';
import { aiScannerService } from '@/backend/services/ai-scanner.service';
import { aiService } from '@/backend/services/ai.service';
import { reportService } from '@/backend/services/report.service';
import { getAvatarUploadUrl, getAvatarPublicUrl } from '@/backend/lib/supabase';
import { eventBus } from '@/backend/lib/events';
import { idParamSchema } from '@/backend/validators/common.validator';
import { transactionQuerySchema, transactionSchema, updateTransactionSchema } from '@/backend/validators/transaction.validator';
import { budgetQuerySchema, budgetSchema, updateBudgetSchema } from '@/backend/validators/budget.validator';
import { savingsGoalSchema, updateSavingsGoalSchema, contributionSchema } from '@/backend/validators/savings.validator';
import { upsertProfileSchema, updateProfileSchema } from '@/backend/validators/profile.validator';

// Standard response helper
function jsonResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

function errorResponse(message: string, status = 500, details?: any) {
  return NextResponse.json({ success: false, message, ...details }, { status });
}

function handleError(error: unknown) {
  console.error('API Error:', error);
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten()
    }, { status: 400 });
  }
  if (error instanceof HttpError) {
    return NextResponse.json({
      success: false,
      message: error.message,
      details: error.details
    }, { status: error.statusCode });
  }
  return NextResponse.json({
    success: false,
    message: error instanceof Error ? error.message : 'Internal server error'
  }, { status: 500 });
}

// Router matching logic
async function handleRoute(req: Request, pathParts: string[], method: string) {
  const segment1 = pathParts[0];
  const segment2 = pathParts[1];
  const segment3 = pathParts[2];

  // 1. Health check doesn't need auth
  if (segment1 === 'health' && method === 'GET') {
    return NextResponse.json({ success: true, message: 'BudgedIn API v1' });
  }

  // 2. Auth checking
  const user = await verifyAuth(req);

  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  let body: any = {};
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await req.json();
    } catch (_) {}
  }

  // 3. Match resource
  switch (segment1) {
    case 'profile':
      if (segment2 === 'me') {
        if (method === 'GET') {
          return jsonResponse(await profileService.get(user.id));
        }
        if (method === 'PUT') {
          return jsonResponse(await profileService.upsert(user.id, upsertProfileSchema.parse(body)));
        }
        if (method === 'PATCH') {
          return jsonResponse(await profileService.update(user.id, updateProfileSchema.parse(body)));
        }
      }
      if (segment2 === 'avatar-upload-url' && method === 'GET') {
        const { fileName } = query;
        if (!fileName) {
          return errorResponse('fileName query parameter is required', 400);
        }
        const signedUrl = await getAvatarUploadUrl(user.id, fileName);
        const publicUrl = getAvatarPublicUrl(`${user.id}/${fileName}`);
        return jsonResponse({ signedUrl, publicUrl });
      }
      if (segment2 === 'reset-data' && method === 'DELETE') {
        await profileService.resetData(user.id);
        return NextResponse.json({ success: true, message: 'All financial data has been reset successfully.' });
      }
      break;

    case 'transactions':
      if (!segment2) {
        if (method === 'GET') {
          return jsonResponse(await transactionService.list(user.id, transactionQuerySchema.parse(query)));
        }
        if (method === 'POST') {
          return jsonResponse(await transactionService.create(user.id, transactionSchema.parse(body)), 201);
        }
      }
      if (segment2 === 'scan-receipt' && method === 'POST') {
        const { image } = body;
        if (!image) {
          return errorResponse('Data gambar Base64 wajib disertakan', 400);
        }
        const data = await aiScannerService.scanReceipt(image);
        return jsonResponse(data);
      }
      if (segment2 && !segment3) {
        // Param is transactional ID
        idParamSchema.parse({ id: segment2 });
        if (method === 'PATCH') {
          return jsonResponse(await transactionService.update(user.id, segment2, updateTransactionSchema.parse(body)));
        }
        if (method === 'DELETE') {
          return jsonResponse(await transactionService.delete(user.id, segment2));
        }
      }
      break;

    case 'budgets':
      if (!segment2) {
        if (method === 'GET') {
          return jsonResponse(await budgetService.list(user.id, budgetQuerySchema.parse(query)));
        }
        if (method === 'POST') {
          return jsonResponse(await budgetService.upsert(user.id, budgetSchema.parse(body)));
        }
      }
      if (segment2 && !segment3) {
        idParamSchema.parse({ id: segment2 });
        if (method === 'PATCH') {
          return jsonResponse(await budgetService.update(user.id, segment2, updateBudgetSchema.parse(body)));
        }
        if (method === 'DELETE') {
          return jsonResponse(await budgetService.delete(user.id, segment2));
        }
      }
      break;

    case 'savings-goals':
      if (!segment2) {
        if (method === 'GET') {
          return jsonResponse(await savingsService.list(user.id));
        }
        if (method === 'POST') {
          return jsonResponse(await savingsService.create(user.id, savingsGoalSchema.parse(body)), 201);
        }
      }
      if (segment2 && !segment3) {
        idParamSchema.parse({ id: segment2 });
        if (method === 'PATCH') {
          return jsonResponse(await savingsService.update(user.id, segment2, updateSavingsGoalSchema.parse(body)));
        }
        if (method === 'DELETE') {
          return jsonResponse(await savingsService.delete(user.id, segment2));
        }
      }
      if (segment2 && segment3 === 'contributions') {
        idParamSchema.parse({ id: segment2 });
        if (method === 'POST') {
          return jsonResponse(await savingsService.contribute(user.id, segment2, contributionSchema.parse(body)), 201);
        }
      }
      break;

    case 'reports':
      if (segment2 === 'dashboard' && method === 'GET') {
        const month = query.month ? parseInt(query.month) : undefined;
        const year = query.year ? parseInt(query.year) : undefined;
        return jsonResponse(await reportService.dashboard(user.id, month, year));
      }
      if (segment2 === 'monthly' && method === 'GET') {
        const month = query.month ? parseInt(query.month) : undefined;
        const year = query.year ? parseInt(query.year) : undefined;
        if (!month || !year) {
          return errorResponse('month and year query parameters are required', 400);
        }
        return jsonResponse(await reportService.monthly(user.id, month, year));
      }
      if (segment2 === 'csv' && method === 'GET') {
        const month = query.month ? parseInt(query.month) : undefined;
        const year = query.year ? parseInt(query.year) : undefined;
        if (!month || !year) {
          return errorResponse('month and year query parameters are required', 400);
        }
        const report = await reportService.monthly(user.id, month, year);
        const rows = [
          'date,title,type,category,amount',
          ...report.transactions.map((item) => [
            item.transactionDate.toISOString(),
            item.title,
            item.type,
            item.category,
            item.amount
          ].join(','))
        ];
        
        return new NextResponse(rows.join('\n'), {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename=budgedin-${year}-${month}.csv`
          }
        });
      }
      break;

    case 'notifications':
      if (segment2 === 'stream' && method === 'GET') {
        const responseStream = new TransformStream();
        const writer = responseStream.writable.getWriter();
        const encoder = new TextEncoder();

        writer.write(encoder.encode(':\n\n'));

        const listener = (eventData: any) => {
          writer.write(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
        };

        eventBus.on(`user:${user.id}`, listener);

        const heartbeat = setInterval(() => {
          writer.write(encoder.encode(':\n\n'));
        }, 30000);

        req.signal?.addEventListener('abort', () => {
          clearInterval(heartbeat);
          eventBus.off(`user:${user.id}`, listener);
          writer.close();
        });

        return new NextResponse(responseStream.readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
          }
        });
      }
      if (!segment2) {
        if (method === 'GET') {
          return jsonResponse(await notificationService.list(user.id));
        }
      }
      if (segment2 === 'read-all' && method === 'PATCH') {
        return jsonResponse(await notificationService.markAllRead(user.id));
      }
      if (segment2 && segment3 === 'read' && method === 'PATCH') {
        idParamSchema.parse({ id: segment2 });
        return jsonResponse(await notificationService.markRead(user.id, segment2));
      }
      break;

    case 'ai':
      if (segment2 === 'chat' && method === 'POST') {
        const { message } = body;
        if (!message || typeof message !== 'string') {
          return errorResponse('Pesan obrolan (message) wajib disertakan', 400);
        }

        let result;
        try {
          result = await aiService.processChat(user.id, message);
        } catch (aiError: any) {
          console.error('Gemini Chat Error:', aiError);
          let friendlyMessage = aiError.message || 'Gagal memproses obrolan';
          if (friendlyMessage.includes('leaked') || friendlyMessage.includes('API key') || friendlyMessage.includes('API_KEY')) {
            friendlyMessage = '⚠️ **Gagal terhubung ke Gemini AI**: API Key yang dikonfigurasi tidak valid atau telah diblokir/bocor. Ganti dengan API Key yang valid.';
          }
          return jsonResponse({
            message: friendlyMessage,
            action: 'none',
            transaction: null
          });
        }

        let createdTransaction: any = null;
        if (result.action === 'create_transaction' && result.transaction) {
          try {
            const tx = result.transaction;
            createdTransaction = await transactionService.create(user.id, {
              title: tx.title,
              amount: tx.amount,
              type: tx.type,
              category: tx.category,
              transactionDate: new Date(tx.transactionDate),
              description: `Dicatat otomatis via Asisten AI`
            });
          } catch (dbError: any) {
            console.error('Gagal mencatat transaksi otomatis via Chat AI:', dbError);
            result.message = `Maaf, saya mendeteksi Anda ingin mencatat "${result.transaction.title}" sebesar Rp ${result.transaction.amount.toLocaleString('id-ID')}, namun terjadi kesalahan saat menyimpannya ke database.`;
            result.action = 'none';
          }
        }

        return jsonResponse({
          message: result.message,
          action: result.action,
          transaction: createdTransaction
        });
      }
      break;

    default:
      break;
  }

  return errorResponse('Not Found', 404);
}

export async function GET(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path = [] } = await params;
    return await handleRoute(req, path, 'GET');
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path = [] } = await params;
    return await handleRoute(req, path, 'POST');
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path = [] } = await params;
    return await handleRoute(req, path, 'PUT');
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path = [] } = await params;
    return await handleRoute(req, path, 'PATCH');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  try {
    const { path = [] } = await params;
    return await handleRoute(req, path, 'DELETE');
  } catch (error) {
    return handleError(error);
  }
}
