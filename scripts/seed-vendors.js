require("dotenv").config();
const mongoose = require("mongoose");
const Vendor = require("../src/models/Vendor");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    const vendors = [
      {
        vendor_type: "external_vendor",
        company_name: "Dubai Elite Motors LLC",
        contact_person_name: "Ahmed Al Mansouri",
        company_phone: "+971 4 123 4567",
        contact_person_phone: "+971 54 321 8884",
        whatsapp_number: "+971 54 321 8884",
        contact_person_email: "ahmed@dubaielitemotors.ae",
        address_line_1: "Sheikh Zayed Road, Business Bay",
        city: "Dubai",
        country: "UAE",
        status: "active",
        is_priority_vendor: true,
        priority_rank: 10,
        notes: "Premium fleet provider in Business Bay.",
      },
      {
        vendor_type: "own_fleet",
        company_name: "4321 Drive Internal Fleet",
        contact_person_name: "Operations Team",
        company_phone: "+971 4 000 0000",
        contact_person_email: "ops@4321drive.com",
        city: "Dubai",
        country: "UAE",
        status: "active",
        is_priority_vendor: true,
        priority_rank: 100,
        notes: "Our internal vehicles",
      },
      {
        vendor_type: "external_vendor",
        company_name: "Luxury Car Rental DXB",
        contact_person_name: "Sarah Jones",
        contact_person_phone: "+971 55 987 6543",
        whatsapp_number: "+971 55 987 6543",
        contact_person_email: "sarah@luxuryrentaldxb.com",
        city: "Dubai",
        country: "UAE",
        status: "active",
        is_priority_vendor: false,
        priority_rank: 0,
      },
      {
        vendor_type: "external_vendor",
        company_name: "Budget Rides UAE",
        contact_person_name: "Mohammed Khan",
        contact_person_phone: "+971 52 111 2222",
        contact_person_email: "info@budgetrides.ae",
        city: "Sharjah",
        country: "UAE",
        status: "active",
        is_priority_vendor: false,
        priority_rank: 0,
      },
      {
        vendor_type: "external_vendor",
        company_name: "Supercars Arabia",
        contact_person_name: "Faisal Al Maktoum",
        contact_person_phone: "+971 56 333 4444",
        whatsapp_number: "+971 56 333 4444",
        contact_person_email: "faisal@supercarsarabia.com",
        city: "Dubai",
        country: "UAE",
        status: "active",
        is_priority_vendor: true,
        priority_rank: 5,
      },
      {
        vendor_type: "external_vendor",
        company_name: "Jumeirah Exotics",
        contact_person_name: "Liam Smith",
        contact_person_phone: "+971 58 555 6666",
        contact_person_email: "liam@jumeirahexotics.ae",
        city: "Dubai",
        country: "UAE",
        status: "pending_verification",
        is_priority_vendor: false,
      },
      {
        vendor_type: "external_vendor",
        company_name: "Abu Dhabi Elite",
        contact_person_name: "Omar Tariq",
        contact_person_phone: "+971 50 777 8888",
        contact_person_email: "omar@adelite.ae",
        city: "Abu Dhabi",
        country: "UAE",
        status: "active",
        is_priority_vendor: false,
      },
      {
        vendor_type: "external_vendor",
        company_name: "Speedy Rentals HQ",
        contact_person_name: "David Chen",
        contact_person_phone: "+971 55 999 0000",
        contact_person_email: "david@speedyrentals.com",
        city: "Dubai",
        country: "UAE",
        status: "inactive",
        is_priority_vendor: false,
      },
    ];

    for (const v of vendors) {
      await Vendor.create(v);
    }

    console.log("Seeded 8 vendors.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
