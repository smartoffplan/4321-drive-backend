const mongoose = require('mongoose');
const ParentVehicle = require('./src/models/ParentVehicle');
const VehicleListing = require('./src/models/VehicleListing');
const parentVehicleService = require('./src/modules/vehicles/parentVehicle.service');
const dotenv = require('dotenv');

dotenv.config();

const parentId = '69bca8f2f6a746e995d70d1b';
const sourceListingId = '69c475b7fc06ee4fb571192e';

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('--- Triggering Recalculation ---');
    await parentVehicleService.recalculatePricing(parentId);
    const updatedParent = await ParentVehicle.findById(parentId);
    console.log('--- Updated Parent Pricing Summary ---');
    console.log(JSON.stringify(updatedParent.pricing_summary, null, 2));

    const sourceListing = await VehicleListing.findById(sourceListingId);
    console.log('--- Source Listing Details ---');
    if (sourceListing) {
      console.log(JSON.stringify(sourceListing, null, 2));
    } else {
      console.log('Source listing not found!');
    }

    const allListings = await VehicleListing.find({ parent_vehicle_id: parentId });
    console.log('--- All Listings for this Parent ---');
    console.log(`Total count: ${allListings.length}`);
    for (const l of allListings) {
      console.log(`- ID: ${l._id}, Vendor: ${l.vendor_id}, Status: ${l.availability_status}, Approval: ${l.verification?.approval_status}, Website Price: ${l.pricing?.website_selling_price_per_day}, Deleted: ${l.deleted_at}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
