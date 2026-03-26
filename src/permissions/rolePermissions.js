const { ROLES } = require('../config/constants');
const P = require('./permissions');

/**
 * Role-to-permissions mapping.
 * super_admin and admin both get full system access.
 * vendor gets own-resource permissions (Phase 2-ready).
 */
const rolePermissions = {
  [ROLES.SUPER_ADMIN]: Object.values(P),

  // Admin has full system access (same as super_admin)
  [ROLES.ADMIN]: Object.values(P),

  [ROLES.VENDOR]: [
    // Phase 2 — vendor self-service permissions
    P.VEHICLES_CHILD_CREATE,
    P.VEHICLES_CHILD_READ,
    P.VEHICLES_CHILD_UPDATE,
  ],
};

/**
 * Get permissions array for a given role.
 * @param {string} role
 * @returns {string[]} permissions
 */
const getRolePermissions = (role) => {
  return rolePermissions[role] || [];
};

module.exports = { rolePermissions, getRolePermissions };
