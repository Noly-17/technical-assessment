import app from './app';
import { config } from './config/environment';
import logger from './config/logger';

// Start the server
const server = app.listen(config.server.port, () => {
  logger.info(`Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`);
  logger.info(`API available at http://localhost:${config.server.port}/api`);
  
  if (config.server.nodeEnv === 'development') {
    logger.info(`API docs available at http://localhost:${config.server.port}/api-docs`);
  }
});

// Handle shutdown gracefully
const shutdown = () => {
  logger.info('Shutting down server');
  server.close(() => {
    logger.info('Server shutdown complete');
    process.exit(0);
  });
  
  // Force close after 10s
  setTimeout(() => {
    logger.error('Forcing server shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default server; 