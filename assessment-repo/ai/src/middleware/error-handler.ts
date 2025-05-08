import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Not found error handler
export function notFoundHandler(req: Request, res: Response) {
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
  });
  
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}

// Custom error interface
export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

// Global error handler
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  
  logger.error('Error processing request', {
    error: err.message,
    stack: err.stack,
    details: err.details,
    method: req.method,
    path: req.path,
  });
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    message: err.message,
    details: err.details,
  });
} 