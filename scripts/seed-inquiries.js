/**
 * Seed script: inserts 12 test booking inquiries into MongoDB.
 * Usage: node scripts/seed-inquiries.js
 *
 * Requires at least one ParentVehicle in the DB.
 * If none exists, the script exits with an error message.
 */

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/4321-drive";

// ---- Inline schemas to avoid circular deps ----
const parentVehicleSchema = new mongoose.Schema({}, { strict: false });
const ParentVehicle = mongoose.model("ParentVehicle", parentVehicleSchema);

const inquiryLogSchema = new mongoose.Schema(
  {
    parent_vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentVehicle",
      required: true,
    },
    source_action: { type: String, default: "booking_form" },
    customer_name: String,
    customer_email: String,
    customer_phone: String,
    drive_mode: { type: String, enum: ["self", "chauffeur"], default: "self" },
    chauffeur_type: String,
    service_type: String,
    language_preference: String,
    pickup_location: String,
    pickup_date: String,
    pickup_time: String,
    return_date: String,
    return_time: String,
    special_instructions: String,
    base_daily_price: Number,
    chauffeur_fee: { type: Number, default: 0 },
    total_daily_price: Number,
    status: { type: String, default: "new" },
    admin_notes: String,
    driver_selected: Boolean,
    page_type: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);
const InquiryLog = mongoose.model("InquiryLog", inquiryLogSchema);

// ---- Test data ----
const CUSTOMERS = [
  {
    name: "James Anderson",
    email: "james.anderson@example.com",
    phone: "+447700900123",
  },
  {
    name: "Sophie Williams",
    email: "sophie.w@example.com",
    phone: "+447700900456",
  },
  {
    name: "David Thompson",
    email: "david.t@example.com",
    phone: "+447700900789",
  },
  { name: "Emma Clarke", email: "emma.c@gmail.com", phone: "+971501234567" },
  { name: "Liam Johnson", email: "liam.j@outlook.com", phone: "+971509876543" },
  {
    name: "Aisha Al Farsi",
    email: "aisha.f@example.ae",
    phone: "+971554321876",
  },
  {
    name: "Carlos Mendez",
    email: "carlos.m@example.com",
    phone: "+15551234567",
  },
  { name: "Yuki Tanaka", email: "yuki.t@sample.jp", phone: "+971558765432" },
  {
    name: "Fatima Al Rashidi",
    email: "fatima.r@gmail.com",
    phone: "+971502345678",
  },
  { name: "Robert King", email: "r.king@business.com", phone: "+447911123456" },
  {
    name: "Natalia Petrov",
    email: "n.petrov@example.ru",
    phone: "+971503456789",
  },
  { name: "Ahmed Hassan", email: "a.hassan@uae.ae", phone: "+971554567890" },
];

const LOCATIONS = [
  "Dubai Marina",
  "Downtown Dubai",
  "Dubai Mall",
  "Dubai Airport (DXB)",
  "Palm Jumeirah",
  "Business Bay",
  "Abu Dhabi International Airport",
  "DIFC",
];

const STATUSES = [
  "new",
  "new",
  "new",
  "contacted",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

const CHAUFFEUR_TYPES = ["standard", "senior", "executive"];
const SERVICE_TYPES = ["full-day", "hourly", "point-to-point"];
const LANGUAGES = ["English", "Arabic", "French", "Russian", null];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function randomDateInPast(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split("T")[0];
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB:", MONGODB_URI);

  // Fetch available vehicle IDs
  const vehicles = await ParentVehicle.find({}, "_id display_name").limit(20);
  if (vehicles.length === 0) {
    console.error(
      "❌ No ParentVehicle documents found. Please seed vehicles first.",
    );
    process.exit(1);
  }
  console.log(`Found ${vehicles.length} vehicle(s) to use.`);

  const inquiries = CUSTOMERS.map((customer, i) => {
    const vehicle = randomItem(vehicles);
    const driveMode = i % 3 === 0 ? "chauffeur" : "self";
    const basePrice = [800, 1200, 1500, 2000, 2500, 3000][i % 6];
    const chauffeurType =
      driveMode === "chauffeur" ? CHAUFFEUR_TYPES[i % 3] : null;
    const serviceType = driveMode === "chauffeur" ? SERVICE_TYPES[i % 3] : null;

    let chauffeurFee = 0;
    if (driveMode === "chauffeur") {
      const base =
        serviceType === "point-to-point"
          ? 150
          : serviceType === "hourly"
            ? 80
            : 500;
      const mult =
        chauffeurType === "senior"
          ? 1.3
          : chauffeurType === "executive"
            ? 1.6
            : 1;
      chauffeurFee = Math.round(base * mult);
    }

    const pickupDate = randomDateInPast(60);
    const returnDate = addDays(pickupDate, (i % 4) + 1);
    const status = STATUSES[i % STATUSES.length];

    return {
      parent_vehicle_id: vehicle._id,
      source_action: "booking_form",
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      drive_mode: driveMode,
      chauffeur_type: chauffeurType,
      service_type: serviceType,
      language_preference:
        driveMode === "chauffeur" ? randomItem(LANGUAGES) : null,
      pickup_location: randomItem(LOCATIONS),
      pickup_date: pickupDate,
      pickup_time: `${9 + (i % 10)}:00`,
      return_date: returnDate,
      return_time: "18:00",
      special_instructions:
        i % 4 === 0 ? "VIP client — champagne service required" : null,
      base_daily_price: basePrice,
      chauffeur_fee: chauffeurFee,
      total_daily_price: basePrice + chauffeurFee,
      status,
      admin_notes:
        status === "contacted"
          ? "Called customer, awaiting confirmation."
          : null,
      driver_selected: driveMode === "chauffeur",
      page_type: "detail",
    };
  });

  const result = await InquiryLog.insertMany(inquiries);
  console.log(`✅ Inserted ${result.length} test inquiries.`);

  await mongoose.disconnect();
  console.log("Disconnected.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
