const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  const port = env.PORT || 8080;

  try {
    // Attempt DB connection
    await connectDB();

    app.listen(port, () => {
      logger.info(`🚀 4321 Drive Backend is ACTIVE on port ${port}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("🔥 FATAL ERROR DURING STARTUP:", error.stack || error);
    process.exit(1);
  }
};

// Global error handlers for better monitoring
process.on("unhandledRejection", (err) => {
  logger.error("🌊 Unhandled Rejection:", { error: err.message, stack: err.stack });
});

process.on("uncaughtException", (err) => {
  logger.error("🌋 Uncaught Exception:", { error: err.message, stack: err.stack });
  process.exit(1);
});

startServer();
