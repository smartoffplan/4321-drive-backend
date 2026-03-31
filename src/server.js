const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const startServer = async () => {
  const port = env.PORT || 8080;
  
  // Start Express server
  const server = app.listen(port, () => {
    logger.info(
      `🚀 4321 Drive Backend running on port ${port} [${env.NODE_ENV}]`,
    );
    logger.info(`   Health: http://localhost:${port}/api/v1/health`);
    
    // Connect to MongoDB after server starts
    connectDB().catch(error => {
      logger.error("Failed to connect to MongoDB on startup:", error);
    });
  });
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
