const mongoose = require('mongoose');
const env = require('../config/env');
const ParentVehicle = require('../models/ParentVehicle');
const { PARENT_VEHICLE_STATUS, PRICING_MODE } = require('../config/constants');
const slugify = require('slugify');

const vehicles = [
  {
    display_name: "Lamborghini Urus",
    brand: "Lamborghini",
    model: "Urus",
    category: "SUV",
    location_default: "London",
    description: "The soul of a super sports car and the functionality of an SUV.",
    long_description: "The Lamborghini Urus is the first Super Sport Utility Vehicle in the world, which combines the soul of a super sports car with the practical functionality of an SUV. Powered by a 4.0-liter twin-turbo V8 engine that produces 650 CV and 850 Nm of torque, Urus accelerates from 0 to 100 km/h in 3.6 seconds and reaches a top speed of 305 km/h.",
    features: ["Apple CarPlay", "Heated Seats", "Sunroof", "Bose Sound System"],
    highlights: ["Super SUV", "V8 Engine", "Italian Design"],
    why_choose: ["Extreme Performance", "Versatile Luxury", "Prestigious Brand"],
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "650 HP",
      top_speed: "305 km/h",
      acceleration: "3.6s",
      fuel_type: "Petrol",
      drive_type: "AWD",
      engine: "4.0L V8 Twin-Turbo"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 1200,
      public_starting_price: 1200
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
    gallery_images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    display_name: "Rolls Royce Ghost",
    brand: "Rolls Royce",
    model: "Ghost",
    category: "Luxury Sedan",
    location_default: "London",
    description: "The purest expression of Rolls-Royce.",
    long_description: "Ghost is the most advanced Rolls-Royce yet. It is a car of simplicity, but that simplicity was one of the most complex things we have ever created. It is the purest expression of Rolls-Royce.",
    features: ["Starlight Headliner", "Rear Suite", "Whisper Quiet Cabin"],
    highlights: ["Ultimate Luxury", "V12 Engine", "British Craftsmanship"],
    why_choose: ["Supreme Comfort", "Status Symbol", "Unmatched Elegance"],
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "563 HP",
      top_speed: "250 km/h",
      acceleration: "4.8s",
      fuel_type: "Petrol",
      drive_type: "AWD",
      engine: "6.75L V12"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 2500,
      public_starting_price: 2500
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1631214524020-5e18397629b3?auto=format&fit=crop&q=80&w=800",
    gallery_images: [
      "https://images.unsplash.com/photo-1631214524020-5e18397629b3?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    display_name: "Audi A8 L",
    brand: "Audi",
    model: "A8",
    variant: "L",
    category: "Luxury Sedan",
    location_default: "Manchester",
    description: "The embodiment of Vorsprung durch Technik.",
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "335 HP",
      top_speed: "250 km/h",
      acceleration: "5.6s",
      fuel_type: "Petrol",
      drive_type: "Quattro AWD",
      engine: "3.0L V6"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 350,
      public_starting_price: 350
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Bentley Continental GT",
    brand: "Bentley",
    model: "Continental GT",
    category: "Sport",
    location_default: "London",
    description: "The definitive Grand Tourer.",
    specs: {
      seats: 4,
      transmission: "Automatic",
      horsepower: "626 HP",
      top_speed: "333 km/h",
      acceleration: "3.7s",
      fuel_type: "Petrol",
      drive_type: "AWD",
      engine: "6.0L W12"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 1500,
      public_starting_price: 1500
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Mercedes-Benz G63 AMG",
    brand: "Mercedes-Benz",
    model: "G63 AMG",
    category: "SUV",
    location_default: "London",
    description: "An off-road legend with AMG performance.",
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "577 HP",
      top_speed: "220 km/h",
      acceleration: "4.5s",
      fuel_type: "Petrol",
      drive_type: "4MATIC AWD",
      engine: "4.0L V8 Bi-Turbo"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 950,
      public_starting_price: 950
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Ferrari F8 Tributo",
    brand: "Ferrari",
    model: "F8 Tributo",
    category: "Sport",
    location_default: "Cambridge",
    description: "The highest expression of the classic two-seater berlinetta.",
    specs: {
      seats: 2,
      transmission: "Automatic",
      horsepower: "710 HP",
      top_speed: "340 km/h",
      acceleration: "2.9s",
      fuel_type: "Petrol",
      drive_type: "RWD",
      engine: "3.9L V8 Twin-Turbo"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 1800,
      public_starting_price: 1800
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Tesla Model S Plaid",
    brand: "Tesla",
    model: "Model S",
    variant: "Plaid",
    category: "Electric",
    location_default: "Brighton",
    description: "Beyond Ludicrous.",
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "1020 HP",
      top_speed: "322 km/h",
      acceleration: "1.99s",
      fuel_type: "Electric",
      drive_type: "AWD",
      engine: "Tri-Motor"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 450,
      public_starting_price: 450
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Range Rover Autobiography",
    brand: "Land Rover",
    model: "Range Rover",
    variant: "Autobiography",
    category: "SUV",
    location_default: "Bristol",
    description: "Peerless refinement and capability.",
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "523 HP",
      top_speed: "250 km/h",
      acceleration: "4.4s",
      fuel_type: "Petrol",
      drive_type: "AWD",
      engine: "4.4L V8"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 650,
      public_starting_price: 650
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "Porsche 911 Carrera",
    brand: "Porsche",
    model: "911 Carrera",
    category: "Sport",
    location_default: "Oxford",
    description: "Timeless design, modern technology.",
    specs: {
      seats: 4,
      transmission: "Automatic",
      horsepower: "379 HP",
      top_speed: "293 km/h",
      acceleration: "4.0s",
      fuel_type: "Petrol",
      drive_type: "RWD",
      engine: "3.0L Flat-6 Twin-Turbo"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 500,
      public_starting_price: 500
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  },
  {
    display_name: "BMW i7 xDrive60",
    brand: "BMW",
    model: "i7",
    category: "Electric",
    location_default: "London",
    description: "The first all-electric 7 Series.",
    specs: {
      seats: 5,
      transmission: "Automatic",
      horsepower: "536 HP",
      top_speed: "240 km/h",
      acceleration: "4.5s",
      fuel_type: "Electric",
      drive_type: "AWD",
      engine: "Dual Electric Motor"
    },
    pricing_summary: {
      display_price_mode: PRICING_MODE.MANUAL_OVERRIDE,
      display_price_override: 700,
      public_starting_price: 700
    },
    public_status: PARENT_VEHICLE_STATUS.ACTIVE,
    main_image: "https://images.unsplash.com/photo-1669287340156-cb30b656715f?auto=format&fit=crop&q=80&w=800",
    gallery_images: []
  }
];

const seedVehicles = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing active parent vehicles to avoid duplicates if re-running
    // Or just check by slug
    
    for (const v of vehicles) {
      const slug = slugify(v.display_name, { lower: true, strict: true });
      const existing = await ParentVehicle.findOne({ slug });
      
      if (!existing) {
        await ParentVehicle.create({
          ...v,
          slug
        });
        console.log(`Created: ${v.display_name}`);
      } else {
        console.log(`Skipped (Exists): ${v.display_name}`);
      }
    }

    console.log('✅ Vehicle seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Vehicle seeding failed:', error.message);
    process.exit(1);
  }
};

seedVehicles();
