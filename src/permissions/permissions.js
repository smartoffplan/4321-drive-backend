/**
 * Permission constant strings for RBAC.
 * Grouped by module for clarity.
 */
const PERMISSIONS = {
  // User management
  USERS_READ: 'users.read',
  USERS_CREATE_ADMIN: 'users.create_admin',
  USERS_UPDATE_ADMIN: 'users.update_admin',
  USERS_DELETE_ADMIN: 'users.delete_admin',
  USERS_CREATE_VENDOR: 'users.create_vendor',
  USERS_UPDATE_VENDOR: 'users.update_vendor',
  USERS_DELETE_VENDOR: 'users.delete_vendor',
  USERS_MANAGE_STATUS: 'users.manage_status',

  // Vendor management
  VENDORS_CREATE: 'vendors.create',
  VENDORS_READ: 'vendors.read',
  VENDORS_UPDATE: 'vendors.update',
  VENDORS_DELETE: 'vendors.delete',
  VENDORS_MANAGE_STATUS: 'vendors.manage_status',

  // Parent vehicles
  VEHICLES_PARENT_CREATE: 'vehicles.parent.create',
  VEHICLES_PARENT_READ: 'vehicles.parent.read',
  VEHICLES_PARENT_UPDATE: 'vehicles.parent.update',
  VEHICLES_PARENT_DISABLE: 'vehicles.parent.disable',
  VEHICLES_PARENT_DELETE: 'vehicles.parent.delete',

  // Child vehicle listings
  VEHICLES_CHILD_CREATE: 'vehicles.child.create',
  VEHICLES_CHILD_READ: 'vehicles.child.read',
  VEHICLES_CHILD_UPDATE: 'vehicles.child.update',
  VEHICLES_CHILD_DISABLE: 'vehicles.child.disable',
  VEHICLES_CHILD_DELETE: 'vehicles.child.delete',
  VEHICLES_CHILD_APPROVE: 'vehicles.child.approve',

  // Pricing
  PRICING_READ_INTERNAL: 'pricing.read_internal',
  PRICING_UPDATE_DISPLAY: 'pricing.update_display',

  // Inquiries
  INQUIRIES_READ: 'inquiries.read',

  // Imports
  IMPORTS_CREATE: 'imports.create',
  IMPORTS_READ: 'imports.read',
};

module.exports = PERMISSIONS;
