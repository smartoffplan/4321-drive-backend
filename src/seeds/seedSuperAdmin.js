/**
 * Seed script — creates initial super admin user.
 * Run: node src/seeds/seedSuperAdmin.js
 */
const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const { ROLES, USER_STATUS } = require('../config/constants');

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ role: ROLES.SUPER_ADMIN });

    if (existing) {
      console.log('Super admin already exists:');
      console.log(`  Email: ${existing.email}`);
      console.log('  Skipping seed.');
      process.exit(0);
    }

    const superAdmin = await User.create({
      full_name: env.SEED_SUPER_ADMIN_NAME,
      email: env.SEED_SUPER_ADMIN_EMAIL,
      password_hash: env.SEED_SUPER_ADMIN_PASSWORD,
      role: ROLES.SUPER_ADMIN,
      status: USER_STATUS.ACTIVE,
    });

    console.log('✅ Super admin created successfully:');
    console.log(`  Name:  ${superAdmin.full_name}`);
    console.log(`  Email: ${superAdmin.email}`);
    console.log(`  Role:  ${superAdmin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
