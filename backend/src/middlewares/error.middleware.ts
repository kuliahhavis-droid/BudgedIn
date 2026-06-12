import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error.js';
import fs from 'fs';
import path from 'path';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const logMessage = `[${new Date().toISOString()}] Error: ${error instanceof Error ? error.stack : String(error)}\n\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), 'error.log'), logMessage);
  } catch (logErr) {
    console.error('Failed to write to error.log', logErr);
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten()
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
  }

  const message = error instanceof Error ? error.message : 'Internal server error';

  return res.status(500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error instanceof Error ? error.stack : undefined } : {})
  });
};
