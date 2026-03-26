const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(env.PORT, () => {
      logger.info(`🚀 4321 Drive Backend running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`   Health: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
