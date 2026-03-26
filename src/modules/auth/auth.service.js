const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');
const { ROLES, USER_STATUS } = require('../../config/constants');

class AuthService {
  /**
   * Register a new admin account (no auth required).
   */
  async register(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw ApiError.conflict('User with this email already exists');
    }

    const user = await User.create({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      role: ROLES.ADMIN,
      password_hash: data.password,
      status: USER_STATUS.ACTIVE,
    });

    const tokens = this.generateTokens(user._id);

    // Store refresh token
    user.refresh_token = tokens.refresh.token;
    await user.save({ validateBeforeSave: false });

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Generate access and refresh tokens for a user.
   */
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY,
    });

    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    });

    return {
      access: {
        token: accessToken,
        expires: env.JWT_ACCESS_EXPIRY,
      },
      refresh: {
        token: refreshToken,
        expires: env.JWT_REFRESH_EXPIRY,
      },
    };
  }

  /**
   * Login with email and password.
   */
  async login(email, password) {
    const user = await User.findOne({ email, deleted_at: null });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw ApiError.unauthorized('Account is not active. Please contact administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this.generateTokens(user._id);

    // Store refresh token
    user.refresh_token = tokens.refresh.token;
    user.last_login_at = new Date();
    await user.save({ validateBeforeSave: false });

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Refresh access token using valid refresh token.
   */
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findOne({
      _id: decoded.userId,
      refresh_token: refreshToken,
      status: 'active',
      deleted_at: null,
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = this.generateTokens(user._id);

    // Rotate refresh token
    user.refresh_token = tokens.refresh.token;
    await user.save({ validateBeforeSave: false });

    return tokens;
  }

  /**
   * Logout — clear refresh token.
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refresh_token: null });
  }

  /**
   * Get current user profile.
   */
  async getMe(userId) {
    const user = await User.findById(userId).select('-password_hash -refresh_token');
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
