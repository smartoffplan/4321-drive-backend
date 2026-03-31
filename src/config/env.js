const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const env = {
  // Cloud Run provides PORT=8080 by default. This ensures we bind to the correct one.
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/4321-drive",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev_access_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  SEED_SUPER_ADMIN_EMAIL:
    process.env.SEED_SUPER_ADMIN_EMAIL || "superadmin@4321drive.com",
  SEED_SUPER_ADMIN_PASSWORD:
    process.env.SEED_SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
  SEED_SUPER_ADMIN_NAME: process.env.SEED_SUPER_ADMIN_NAME || "Super Admin",

  isDev: () => env.NODE_ENV === "development",
  isProd: () => env.NODE_ENV === "production",
};

module.exports = env;
