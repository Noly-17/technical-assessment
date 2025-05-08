import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

import { config } from './config/environment';
import logger from './config/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import feedbackRoutes from './routes/feedback';

const app = express();

const requestLogger = pinoHttp({
  logger,
  customLogLevel: function customLogLevel(
    req: Request,
    res: Response,
    error?: Error
  ) {
    if (error) return 'error';
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500) return 'error';
    return 'info';
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', feedbackRoutes);

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
