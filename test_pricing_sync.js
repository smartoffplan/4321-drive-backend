const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ParentVehicle = require('./src/models/ParentVehicle');
const VehicleListing = require('./src/models/VehicleListing');
const vehicleListingService = require('./src/modules/listings/vehicleListing.service');
const { ROLES, LISTING_STATUS } = require('./src/config/constants');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const parentId = '69c71fdce0b7c1b4477cf7ec'; // Lamborghini Urus ID from user
    const adminUser = { _id: new mongoose.Types.ObjectId(), role: ROLES.ADMIN };

    console.log('--- Creating Listing 1 (950) ---');
    const listing1 = await vehicleListingService.create({
      parent_vehicle_id: parentId,
      vendor_id: '69c3ce28b6d4f9fcb7de7a1a', 
      pricing: { vendor_base_price_per_day: 850, website_selling_price_per_day: 950 },
      availability_status: LISTING_STATUS.ACTIVE
    }, adminUser);

    console.log('Listing 1 created:', listing1.pricing.website_selling_price_per_day, 'Status:', listing1.availability_status, 'Approval:', listing1.verification.approval_status);

    const parentAfter1 = await ParentVehicle.findById(parentId);
    console.log('Parent Calculated Price after Listing 1:', parentAfter1.pricing_summary.calculated_min_daily_price);

    console.log('--- Creating Listing 2 (1250) ---');
    const listing2 = await vehicleListingService.create({
      parent_vehicle_id: parentId,
      vendor_id: '69c3ce28b6d4f9fcb7de7a1a',
      pricing: { vendor_base_price_per_day: 1150, website_selling_price_per_day: 1250 },
      availability_status: LISTING_STATUS.ACTIVE
    }, adminUser);

    console.log('Listing 2 created:', listing2.pricing.website_selling_price_per_day);

    const parentAfter2 = await ParentVehicle.findById(parentId);
    console.log('Parent Calculated Price after Listing 2 (should still be 950):', parentAfter2.pricing_summary.calculated_min_daily_price);

    // Cleanup
    await VehicleListing.deleteMany({ _id: { $in: [listing1._id, listing2._id] } });
    console.log('Cleanup complete');
    
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
