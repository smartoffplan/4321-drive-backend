const User = require('../../models/User');
const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../config/constants');

class UserService {
  /**
   * Create a new admin user.
   */
  async createAdmin(data, createdBy) {
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
      status: data.status,
      created_by: createdBy,
    });

    return user.toJSON();
  }

  /**
   * Get paginated list of admin users.
   */
  async getAdmins(query) {
    const { page = 1, limit = 20, status, search } = query;
    const skip = (page - 1) * limit;

    const filter = { role: ROLES.ADMIN, deleted_at: null };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password_hash -refresh_token').sort({ created_at: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single admin by ID.
   */
  async getAdminById(id) {
    const user = await User.findOne({ _id: id, role: ROLES.ADMIN, deleted_at: null })
      .select('-password_hash -refresh_token');

    if (!user) {
      throw ApiError.notFound('Admin user not found');
    }

    return user;
  }

  /**
   * Update an admin user.
   */
  async updateAdmin(id, data, updatedBy) {
    const user = await User.findOne({ _id: id, role: ROLES.ADMIN, deleted_at: null });

    if (!user) {
      throw ApiError.notFound('Admin user not found');
    }

    // Check email uniqueness if email changed
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ email: data.email });
      if (existing) {
        throw ApiError.conflict('Email already in use');
      }
    }

    if (data.full_name) user.full_name = data.full_name;
    if (data.email) user.email = data.email;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.password) user.password_hash = data.password;
    if (data.status) user.status = data.status;
    user.updated_by = updatedBy;

    await user.save();
    return user.toJSON();
  }

  /**
   * Soft delete an admin user (super_admin only).
   */
  async deleteAdmin(id) {
    const user = await User.findOne({ _id: id, role: ROLES.ADMIN, deleted_at: null });

    if (!user) {
      throw ApiError.notFound('Admin user not found');
    }

    user.deleted_at = new Date();
    user.status = 'inactive';
    await user.save({ validateBeforeSave: false });

    return { message: 'Admin user deactivated successfully' };
  }
}

module.exports = new UserService();
