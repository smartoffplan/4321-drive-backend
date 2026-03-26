const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * JWT authentication middleware.
 * Verifies the access token from Authorization header and attaches user to req.
 */
const auth = async (req, _res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    console.log('Backend Auth - Header:', authHeader ? 'Found' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Backend Auth - Error: Access token required');
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      console.log('Backend Auth - Decoded:', decoded.userId);
    } catch (jwtError) {
      console.log('Backend Auth - JWT Verify Error:', jwtError.message);
      throw jwtError;
    }

    const user = await User.findOne({
      _id: decoded.userId,
      status: 'active',
      deleted_at: null,
    }).select('-password_hash');

    if (!user) {
      console.log('Backend Auth - Error: User not found or inactive');
      throw ApiError.unauthorized('User not found or inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Backend Auth - Catch Block Error:', error.message);
    if (error instanceof ApiError) {
      return next(error);
    }

    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid access token'));
    }

    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Access token expired'));
    }

    next(ApiError.unauthorized('Authentication failed'));
  }
};

module.exports = auth;
