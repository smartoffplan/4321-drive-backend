require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('../src/models/Vendor');
const ParentVehicle = require('../src/models/ParentVehicle');
const VehicleListing = require('../src/models/VehicleListing');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB.');

    // Check if listings already exist
    const existingCount = await VehicleListing.countDocuments({ deleted_at: null });
    if (existingCount > 0) {
      console.log(`Already ${existingCount} listings in DB. Skipping seed.`);
      process.exit(0);
    }

    const vendors = await Vendor.find({ deleted_at: null, status: 'active' });
    const parentVehicles = await ParentVehicle.find({ deleted_at: null });

    if (vendors.length === 0 || parentVehicles.length === 0) {
      console.error('No vendors or parent vehicles found. Seed those first.');
      process.exit(1);
    }

    console.log(`Found ${vendors.length} active vendors and ${parentVehicles.length} parent vehicles.`);

    // Listing templates — distributed across vendors & vehicles
    const listings = [
      // Lamborghini Urus — 3 vendors
      { vehicleIdx: 0, vendorIdx: 0, pricing: { vendor_base_price_per_day: 1000, website_selling_price_per_day: 1200, display_price_candidate_per_day: 1200, weekly_price: 7500, monthly_price: 28000 }, chauffeur: { driver_available: true, driver_price_per_day: 400, driver_notes: 'Professional chauffeur available' }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 0, vendorIdx: 1, pricing: { vendor_base_price_per_day: 950, website_selling_price_per_day: 1150, display_price_candidate_per_day: 1150, weekly_price: 7200, monthly_price: 27000 }, chauffeur: { driver_available: true, driver_price_per_day: 350 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 0, vendorIdx: 4, pricing: { vendor_base_price_per_day: 1100, website_selling_price_per_day: 1300, display_price_candidate_per_day: 1300, weekly_price: 8000, monthly_price: 30000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },

      // Rolls Royce Ghost — 4 vendors
      { vehicleIdx: 1, vendorIdx: 0, pricing: { vendor_base_price_per_day: 2000, website_selling_price_per_day: 2500, display_price_candidate_per_day: 2500, weekly_price: 15000, monthly_price: 55000 }, chauffeur: { driver_available: true, driver_price_per_day: 600, driver_notes: 'VIP chauffeur service included' }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 1, vendorIdx: 1, pricing: { vendor_base_price_per_day: 1900, website_selling_price_per_day: 2400, display_price_candidate_per_day: 2400, weekly_price: 14500, monthly_price: 52000 }, chauffeur: { driver_available: true, driver_price_per_day: 550 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 1, vendorIdx: 4, pricing: { vendor_base_price_per_day: 2200, website_selling_price_per_day: 2700, display_price_candidate_per_day: 2700, weekly_price: 16000, monthly_price: 58000 }, chauffeur: { driver_available: true, driver_price_per_day: 650 }, availability_status: 'pending_approval', own_fleet_priority: false },
      { vehicleIdx: 1, vendorIdx: 5, pricing: { vendor_base_price_per_day: 2100, website_selling_price_per_day: 2600, display_price_candidate_per_day: 2600, weekly_price: 15500, monthly_price: 56000 }, chauffeur: { driver_available: false }, availability_status: 'draft', own_fleet_priority: false },

      // Audi A8 L — 3 vendors
      { vehicleIdx: 2, vendorIdx: 1, pricing: { vendor_base_price_per_day: 280, website_selling_price_per_day: 350, display_price_candidate_per_day: 350, weekly_price: 2200, monthly_price: 8000 }, chauffeur: { driver_available: true, driver_price_per_day: 250 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 2, vendorIdx: 2, pricing: { vendor_base_price_per_day: 300, website_selling_price_per_day: 380, display_price_candidate_per_day: 380 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 2, vendorIdx: 3, pricing: { vendor_base_price_per_day: 260, website_selling_price_per_day: 320, display_price_candidate_per_day: 320, weekly_price: 2000, monthly_price: 7500 }, chauffeur: { driver_available: true, driver_price_per_day: 200 }, availability_status: 'active', own_fleet_priority: false },

      // Bentley Continental GT — 3 vendors
      { vehicleIdx: 3, vendorIdx: 0, pricing: { vendor_base_price_per_day: 1200, website_selling_price_per_day: 1500, display_price_candidate_per_day: 1500, weekly_price: 9500, monthly_price: 35000 }, chauffeur: { driver_available: true, driver_price_per_day: 450 }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 3, vendorIdx: 1, pricing: { vendor_base_price_per_day: 1150, website_selling_price_per_day: 1450, display_price_candidate_per_day: 1450, weekly_price: 9000, monthly_price: 33000 }, chauffeur: { driver_available: true, driver_price_per_day: 400 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 3, vendorIdx: 4, pricing: { vendor_base_price_per_day: 1300, website_selling_price_per_day: 1600, display_price_candidate_per_day: 1600 }, chauffeur: { driver_available: false }, availability_status: 'temporarily_unavailable', own_fleet_priority: false },

      // Mercedes G63 AMG — 4 vendors
      { vehicleIdx: 4, vendorIdx: 0, pricing: { vendor_base_price_per_day: 750, website_selling_price_per_day: 950, display_price_candidate_per_day: 950, weekly_price: 6000, monthly_price: 22000 }, chauffeur: { driver_available: true, driver_price_per_day: 350 }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 4, vendorIdx: 1, pricing: { vendor_base_price_per_day: 700, website_selling_price_per_day: 900, display_price_candidate_per_day: 900, weekly_price: 5800, monthly_price: 21000 }, chauffeur: { driver_available: true, driver_price_per_day: 300 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 4, vendorIdx: 2, pricing: { vendor_base_price_per_day: 780, website_selling_price_per_day: 980, display_price_candidate_per_day: 980 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 4, vendorIdx: 5, pricing: { vendor_base_price_per_day: 800, website_selling_price_per_day: 1000, display_price_candidate_per_day: 1000, weekly_price: 6200, monthly_price: 23000 }, chauffeur: { driver_available: true, driver_price_per_day: 380 }, availability_status: 'inactive', own_fleet_priority: false },

      // Ferrari F8 Tributo — 3 vendors
      { vehicleIdx: 5, vendorIdx: 0, pricing: { vendor_base_price_per_day: 1500, website_selling_price_per_day: 1800, display_price_candidate_per_day: 1800, weekly_price: 11000, monthly_price: 40000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 5, vendorIdx: 4, pricing: { vendor_base_price_per_day: 1600, website_selling_price_per_day: 1900, display_price_candidate_per_day: 1900, weekly_price: 12000, monthly_price: 42000 }, chauffeur: { driver_available: true, driver_price_per_day: 500, driver_notes: 'Experienced supercar driver' }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 5, vendorIdx: 1, pricing: { vendor_base_price_per_day: 1450, website_selling_price_per_day: 1750, display_price_candidate_per_day: 1750, weekly_price: 10500, monthly_price: 38000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: true },

      // Tesla Model S Plaid — 3 vendors
      { vehicleIdx: 6, vendorIdx: 1, pricing: { vendor_base_price_per_day: 350, website_selling_price_per_day: 450, display_price_candidate_per_day: 450, weekly_price: 2800, monthly_price: 10000 }, chauffeur: { driver_available: true, driver_price_per_day: 200 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 6, vendorIdx: 3, pricing: { vendor_base_price_per_day: 380, website_selling_price_per_day: 480, display_price_candidate_per_day: 480, weekly_price: 3000, monthly_price: 11000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 6, vendorIdx: 5, pricing: { vendor_base_price_per_day: 400, website_selling_price_per_day: 500, display_price_candidate_per_day: 500 }, chauffeur: { driver_available: false }, availability_status: 'pending_approval', own_fleet_priority: false },

      // Range Rover Autobiography — 4 vendors
      { vehicleIdx: 7, vendorIdx: 0, pricing: { vendor_base_price_per_day: 500, website_selling_price_per_day: 650, display_price_candidate_per_day: 650, weekly_price: 4000, monthly_price: 15000 }, chauffeur: { driver_available: true, driver_price_per_day: 300 }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 7, vendorIdx: 1, pricing: { vendor_base_price_per_day: 480, website_selling_price_per_day: 620, display_price_candidate_per_day: 620, weekly_price: 3800, monthly_price: 14000 }, chauffeur: { driver_available: true, driver_price_per_day: 280 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 7, vendorIdx: 2, pricing: { vendor_base_price_per_day: 520, website_selling_price_per_day: 680, display_price_candidate_per_day: 680 }, chauffeur: { driver_available: false }, availability_status: 'booked', own_fleet_priority: false },
      { vehicleIdx: 7, vendorIdx: 3, pricing: { vendor_base_price_per_day: 490, website_selling_price_per_day: 630, display_price_candidate_per_day: 630, weekly_price: 3900, monthly_price: 14500 }, chauffeur: { driver_available: true, driver_price_per_day: 290 }, availability_status: 'active', own_fleet_priority: false },

      // Porsche 911 Carrera — 3 vendors
      { vehicleIdx: 8, vendorIdx: 0, pricing: { vendor_base_price_per_day: 400, website_selling_price_per_day: 500, display_price_candidate_per_day: 500, weekly_price: 3200, monthly_price: 12000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 8, vendorIdx: 4, pricing: { vendor_base_price_per_day: 420, website_selling_price_per_day: 520, display_price_candidate_per_day: 520, weekly_price: 3400, monthly_price: 12500 }, chauffeur: { driver_available: true, driver_price_per_day: 250, driver_notes: 'Sports car driving experience' }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 8, vendorIdx: 1, pricing: { vendor_base_price_per_day: 380, website_selling_price_per_day: 480, display_price_candidate_per_day: 480, weekly_price: 3000, monthly_price: 11500 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: true },

      // BMW i7 — 3 vendors
      { vehicleIdx: 9, vendorIdx: 1, pricing: { vendor_base_price_per_day: 550, website_selling_price_per_day: 700, display_price_candidate_per_day: 700, weekly_price: 4500, monthly_price: 16000 }, chauffeur: { driver_available: true, driver_price_per_day: 300 }, availability_status: 'active', own_fleet_priority: true },
      { vehicleIdx: 9, vendorIdx: 3, pricing: { vendor_base_price_per_day: 580, website_selling_price_per_day: 720, display_price_candidate_per_day: 720, weekly_price: 4700, monthly_price: 17000 }, chauffeur: { driver_available: false }, availability_status: 'active', own_fleet_priority: false },
      { vehicleIdx: 9, vendorIdx: 5, pricing: { vendor_base_price_per_day: 600, website_selling_price_per_day: 750, display_price_candidate_per_day: 750 }, chauffeur: { driver_available: true, driver_price_per_day: 320 }, availability_status: 'draft', own_fleet_priority: false },
    ];

    let created = 0;
    for (const tpl of listings) {
      const vehicle = parentVehicles[tpl.vehicleIdx % parentVehicles.length];
      const vendor = vendors[tpl.vendorIdx % vendors.length];

      await VehicleListing.create({
        parent_vehicle_id: vehicle._id,
        vendor_id: vendor._id,
        own_fleet_priority: tpl.own_fleet_priority,
        pricing: tpl.pricing,
        chauffeur: tpl.chauffeur,
        availability_status: tpl.availability_status,
        pricing_unit_default: 'day',
        verification: {
          is_verified: tpl.availability_status === 'active',
          approval_status: tpl.availability_status === 'active' ? 'approved' : 'pending',
        },
        source: { source_type: 'manual' },
        internal_notes: `Seed listing for ${vehicle.display_name} via ${vendor.company_name}`,
      });
      created++;
    }

    console.log(`✅ Seeded ${created} vehicle listings.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

run();
