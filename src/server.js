const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    // Start Express server FIRST (required for Cloud Run health check)
    const port = process.env.PORT || env.PORT || 8080;
    app.listen(port, () => {
      logger.info(
        `🚀 4321 Drive Backend running on port ${port} [${env.NODE_ENV}]`,
      );
      logger.info(`   Health: http://localhost:${port}/api/v1/health`);
    });

    // Connect to MongoDB in background (non-blocking)
    connectDB().catch((error) => {
      logger.error(`Failed to connect to MongoDB: ${error.message}`);
      // App continues running; DB-dependent routes will fail gracefully
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();
