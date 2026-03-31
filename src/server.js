const startServer = async () => {
  try {
    console.log("⚙️ Starting 4321 Drive Backend...");
    
    // Defer loading modules to catch potential import errors
    const app = require("./app");
    const env = require("./config/env");
    const connectDB = require("./config/db");
    const logger = require("./utils/logger");

    const port = process.env.PORT || env.PORT || 8080;
    
    logger.info(`🚀 Starting Express on port ${port}...`);

    const server = app.listen(port, () => {
      logger.info(`✨ 4321 Drive Backend is UP on port ${port}`);
      
      // Connect to DB after server is operational
      connectDB().catch(err => {
        logger.error("❌ MongoDB connection failed:", err.message);
      });
    });

  } catch (error) {
    console.error("🔥 FATAL CRASH DURING STARTUP:");
    console.error(error.stack || error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("🌊 Unhandled Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("🌋 Uncaught Exception:", err);
  process.exit(1);
});

startServer();
