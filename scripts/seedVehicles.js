/**
 * Script to seed parent vehicles from vehicle_data.js into the database
 * Usage: node scripts/seedVehicles.js
 */

// Load environment variables from .env file
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const ParentVehicle = require("../src/models/ParentVehicle");
const { vehicle_data } = require("../vehicle_data");
const { PARENT_VEHICLE_STATUS } = require("../src/config/constants");

// MongoDB connection string - adjust as needed for your environment
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://invest_db_user:iaEQCgRCRuZYsFRz@4321-drive.sjmegaq.mongodb.net/4321-drive";

// Valid categories as per requirements
const VALID_CATEGORIES = [
  "luxury",
  "sports",
  "convertible",
  "SUVs",
  "SuperCars",
  "7Seater",
  "8Seater",
];

// Category mapping from source data to valid categories
const categoryMapping = {
  Supercar: "SuperCars",
  SuperCar: "SuperCars",
  supercar: "SuperCars",
  SUV: "SUVs",
  suv: "SUVs",
  Convertible: "convertible",
  convertible: "convertible",
  Sports: "sports",
  sports: "sports",
  Luxury: "luxury",
  luxury: "luxury",
  "7Seater": "7Seater",
  "8Seater": "8Seater",
};

/**
 * Map category to valid category
 */
function mapCategory(sourceCategory) {
  if (!sourceCategory) return "luxury";

  const mapped = categoryMapping[sourceCategory];
  if (mapped && VALID_CATEGORIES.includes(mapped)) {
    return mapped;
  }

  // Try case-insensitive match
  const lowerCategory = sourceCategory.toLowerCase();
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (
      key.toLowerCase() === lowerCategory &&
      VALID_CATEGORIES.includes(value)
    ) {
      return value;
    }
  }

  // Default fallback based on keywords
  const categoryLower = sourceCategory.toLowerCase();
  if (categoryLower.includes("supercar") || categoryLower.includes("super car"))
    return "SuperCars";
  if (categoryLower.includes("suv")) return "SUVs";
  if (
    categoryLower.includes("convertible") ||
    categoryLower.includes("convertable")
  )
    return "convertible";
  if (categoryLower.includes("sport")) return "sports";
  if (categoryLower.includes("7") || categoryLower.includes("seven"))
    return "7Seater";
  if (categoryLower.includes("8") || categoryLower.includes("eight"))
    return "8Seater";

  return "luxury"; // default
}

/**
 * Generate a unique slug from display name
 */
async function generateSlug(displayName) {
  const slugify = require("slugify");
  let slug = slugify(displayName, { lower: true, strict: true });

  // Check if slug exists and append timestamp if needed
  const existing = await ParentVehicle.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
}

/**
 * Transform vehicle data to match ParentVehicle schema
 */
async function transformVehicle(vehicle, index) {
  const slug = await generateSlug(vehicle.display_name);

  // Generate a mock user ID for created_by (this should be replaced with actual admin user ID)
  // Using a placeholder ObjectId - in production, use actual admin user ID
  const mockAdminId = new mongoose.Types.ObjectId();

  return {
    slug: slug,
    display_name: vehicle.display_name,
    brand: vehicle.brand,
    model: vehicle.model,
    variant: vehicle.variant || null,
    model_year: vehicle.model_year || null,
    category: mapCategory(vehicle.category),
    tags: vehicle.tags || [],
    location_default: vehicle.location_default || "Dubai",

    // Images - always null/empty as per requirements
    main_image: null,
    gallery_images: [],
    thumbnail: null,

    // Descriptions
    description: vehicle.description || null,
    long_description: vehicle.long_description || null,
    features: vehicle.features || [],
    highlights: vehicle.highlights || [],
    why_choose: vehicle.why_choose || [],

    // Specs
    specs: {
      passengers: vehicle.specs?.passengers || null,
      luggage: vehicle.specs?.luggage || null,
      transmission: vehicle.specs?.transmission || null,
      doors: vehicle.specs?.doors || null,
      engine: vehicle.specs?.engine || null,
      fuel_type: vehicle.specs?.fuel_type || null,
      horsepower: vehicle.specs?.horsepower || null,
      acceleration: vehicle.specs?.acceleration || null,
      top_speed: vehicle.specs?.top_speed || null,
      drive_type: vehicle.specs?.drive_type || null,
    },

    // Chauffeur - always true as per requirements
    has_chauffeur: true,
    chauffeur_price_per_day: null,
    chauffeur_note: null,

    // Vendors
    available_vendors: [],

    // Pricing Summary - empty/default
    pricing_summary: {
      display_price_mode: "auto_min_child_price",
      display_price_override: null,
      calculated_min_daily_price: null,
      public_starting_price: null,
      weekly_price_public: null,
      monthly_price_public: null,
      price_source_child_listing_id: null,
    },

    // Display Settings
    display_settings: {
      is_featured: false,
      sort_priority: index,
      show_on_frontend: true,
    },

    // Status - active as per requirements
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,

    // SEO
    seo: {
      meta_title: null,
      meta_description: null,
      canonical_url: null,
    },

    // Audit
    created_by: mockAdminId,
    updated_by: mockAdminId,
    deleted_at: null,
  };
}

/**
 * Seed vehicles into database
 */
async function seedVehicles() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log(`Found ${vehicle_data.length} vehicles to seed`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process vehicles one by one to handle slugs properly
    for (let i = 0; i < vehicle_data.length; i++) {
      const vehicle = vehicle_data[i];

      try {
        // Check if vehicle with same display_name already exists
        const existing = await ParentVehicle.findOne({
          display_name: vehicle.display_name,
          deleted_at: null,
        });

        if (existing) {
          console.log(
            `[${i + 1}/${vehicle_data.length}] Skipping: "${vehicle.display_name}" already exists`,
          );
          continue;
        }

        // Transform vehicle data
        const transformedData = await transformVehicle(vehicle, i);

        // Create vehicle
        const createdVehicle = await ParentVehicle.create(transformedData);

        console.log(
          `[${i + 1}/${vehicle_data.length}] Created: "${createdVehicle.display_name}" (ID: ${createdVehicle._id}, Category: ${createdVehicle.category})`,
        );
        successCount++;
      } catch (error) {
        console.error(
          `[${i + 1}/${vehicle_data.length}] Error creating "${vehicle.display_name}": ${error.message}`,
        );
        errors.push({ vehicle: vehicle.display_name, error: error.message });
        errorCount++;
      }
    }

    console.log("\n========================================");
    console.log("Seeding completed!");
    console.log("========================================");
    console.log(`Total vehicles processed: ${vehicle_data.length}`);
    console.log(`Successfully created: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(
      `Skipped (already exists): ${vehicle_data.length - successCount - errorCount}`,
    );

    if (errors.length > 0) {
      console.log("\nErrors encountered:");
      errors.forEach(({ vehicle, error }) => {
        console.log(`  - ${vehicle}: ${error}`);
      });
    }

    // Show category distribution
    console.log("\nCategory distribution:");
    const categoryCounts = {};
    const allVehicles = await ParentVehicle.find({ deleted_at: null });
    allVehicles.forEach((v) => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
    });
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count}`);
    });
  } catch (error) {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  }
}

// Run the seed function
seedVehicles();
