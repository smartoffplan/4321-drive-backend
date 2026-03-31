const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const vendorRoutes = require("./modules/vendors/vendor.routes");
const parentVehicleRoutes = require("./modules/vehicles/parentVehicle.routes");
const vehicleListingRoutes = require("./modules/listings/vehicleListing.routes");
const inquiryRoutes = require("./modules/inquiries/inquiry.routes");
const importRoutes = require("./modules/imports/import.routes");
const publicRoutes = require("./modules/public/public.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

const app = express();

// Trust proxy is needed for Cloud Run to correctly identify client IPs for rate limiting
app.set("trust proxy", 1);

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
const allowedOrigins = [
  ...env.CORS_ORIGIN.split(",").map((o) => o.trim()),
  "http://localhost:3000",
  "http://localhost:8080",
  "https://4321-drive.vercel.app",
  "https://drive-4321-backend-1647851889.me-central1.run.app",
].map((o) => o?.toLowerCase().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // Clean up origin before comparison
      const incomingOrigin = origin.toLowerCase().replace(/\/$/, "");
      if (allowedOrigins.indexOf(incomingOrigin) === -1) {
        logger.warn(`Rejected origin: ${incomingOrigin}`);
        return callback(null, false); // Return false instead of Error for better browser behavior
      }
      return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(mongoSanitize());

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Logging ───────────────────────────────────────────────────────────────────
const morganStream = { write: (msg) => logger.http(msg.trim()) };
app.use(morgan("combined", { stream: morganStream }));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use("/api/", apiLimiter);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "4321 Drive Backend is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Swagger Documentation ─────────────────────────────────────────────────────
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/vehicles/parents", parentVehicleRoutes);
app.use("/api/v1/vehicle-listings", vehicleListingRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/imports", importRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/upload", uploadRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// ─── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
