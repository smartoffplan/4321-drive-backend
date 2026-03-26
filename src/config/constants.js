/**
 * Application-wide constants and enums
 */

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VENDOR: 'vendor', // Phase 2-ready
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const VENDOR_TYPE = {
  OWN_FLEET: 'own_fleet',
  EXTERNAL_VENDOR: 'external_vendor',
};

const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING_VERIFICATION: 'pending_verification',
  BLOCKED: 'blocked',
};

const PARENT_VEHICLE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
};

const LISTING_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  ACTIVE: 'active',
  TEMPORARILY_UNAVAILABLE: 'temporarily_unavailable',
  BOOKED: 'booked',
  INACTIVE: 'inactive',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
};

const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const PRICING_MODE = {
  AUTO_MIN_CHILD_PRICE: 'auto_min_child_price',
  MANUAL_OVERRIDE: 'manual_override',
  PREFERRED_VENDOR_PRICE: 'preferred_vendor_price',
};

const SOURCE_TYPE = {
  MANUAL: 'manual',
  CSV: 'csv',
  SCRAPE: 'scrape',
  API_FUTURE: 'api_future',
};

const PRICING_UNIT = {
  DAY: 'day',
  HOUR: 'hour',
  WEEK: 'week',
  MONTH: 'month',
};

module.exports = {
  ROLES,
  USER_STATUS,
  VENDOR_TYPE,
  VENDOR_STATUS,
  PARENT_VEHICLE_STATUS,
  LISTING_STATUS,
  APPROVAL_STATUS,
  PRICING_MODE,
  SOURCE_TYPE,
  PRICING_UNIT,
};
