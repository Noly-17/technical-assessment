import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import { config } from './config/environment';
import logger from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import feedbackRoutes from './routes/feedback';

// Create Express application
const app = express();

// Set up request logging
const requestLogger = pinoHttp({
  logger,
  customLogLevel: function customLogLevel(req, res, err) {
    if (err) return 'error';
    if (res.statusCode && res.statusCode >= 400 && res.statusCode < 500)
      return 'warn';
    if (res.statusCode && res.statusCode >= 500) return 'error';
    return 'info';
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// API routes
app.use('/api', feedbackRoutes);

// Swagger documentation
if (config.server.nodeEnv === 'development') {
  try {
    const swaggerFile = fs.readFileSync('./swagger.json', 'utf8');
    const swaggerDocument = JSON.parse(swaggerFile);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger documentation available at /api-docs');
  } catch (error) {
    logger.warn('Swagger documentation not available', { error });
  }
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
