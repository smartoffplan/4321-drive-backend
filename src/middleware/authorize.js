const ApiError = require('../utils/ApiError');
const { getRolePermissions } = require('../permissions/rolePermissions');

/**
 * Authorization middleware — checks if the user's role has ALL required permissions.
 * Usage: authorize('vehicles.parent.create', 'vehicles.parent.update')
 */
const authorize = (...requiredPermissions) => {
  return (req, _res, next) => {
    if (!req.user) {
      console.error('Backend Authorize - Error: No user on request');
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userPermissions = getRolePermissions(req.user.role);
    console.log('Backend Authorize - User Role:', req.user.role, 'Permissions:', userPermissions ? 'Loaded' : 'None');

    if (!userPermissions) {
      console.error('Backend Authorize - Error: Unknown role', req.user.role);
      return next(ApiError.forbidden('Unknown role'));
    }

    const hasAll = requiredPermissions.every((perm) => userPermissions.includes(perm));
    console.log('Backend Authorize - Required:', requiredPermissions, 'HasAll:', hasAll);

    if (!hasAll) {
      console.error('Backend Authorize - Error: Missing permission');
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = authorize;
