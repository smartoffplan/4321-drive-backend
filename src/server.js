const express = require('express');

const startServer = async () => {
  const port = process.env.PORT || 8080;
  const tempApp = express();

  // Create a minimal health check that works immediately
  tempApp.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: "Starting", timestamp: new Date().toISOString() });
  });

  const server = tempApp.listen(port, async () => {
    console.log(`✨ 4321 Drive Backend is ACTIVE on port ${port} (Safe-Load Mode)`);
    
    try {
      console.log("⚙️ Loading application logic...");
      
      // Load dependencies after the port is already listening
      const app = require("./app");
      const env = require("./config/env");
      const connectDB = require("./config/db");
      const logger = require("./utils/logger");

      console.log("📦 Dependencies loaded. Initializing systems...");

      // Switch the request handler from the temporary app to the real one
      server.removeAllListeners('request');
      server.on('request', app);

      logger.info(`🚀 4321 Drive Backend is fully operational on port ${port}`);
      
      // Attempt DB connection in the background
      connectDB().catch(err => {
        logger.error("❌ MongoDB connection error:", err.message);
      });

    } catch (error) {
      console.error("🔥 FATAL ERROR DURING APPLICATION LOADING:");
      console.error(error.stack || error);
      // We keep the server alive so that we can see these logs in the Cloud Run console
    }
  });
};

// Global error handlers
process.on("unhandledRejection", (err) => {
  console.error("🌊 Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("🌋 Uncaught Exception:", err);
});

startServer();
