const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class UserController {
  createAdmin = asyncHandler(async (req, res) => {
    const user = await userService.createAdmin(req.body, req.user._id);
    ApiResponse.created(res, 'Admin created successfully', user);
  });

  getAdmins = asyncHandler(async (req, res) => {
    const result = await userService.getAdmins(req.query);
    ApiResponse.paginated(res, 'Admins retrieved successfully', result.users, result.pagination);
  });

  getAdminById = asyncHandler(async (req, res) => {
    const user = await userService.getAdminById(req.params.id);
    ApiResponse.success(res, 'Admin retrieved successfully', user);
  });

  updateAdmin = asyncHandler(async (req, res) => {
    const user = await userService.updateAdmin(req.params.id, req.body, req.user._id);
    ApiResponse.success(res, 'Admin updated successfully', user);
  });

  deleteAdmin = asyncHandler(async (req, res) => {
    const result = await userService.deleteAdmin(req.params.id);
    ApiResponse.success(res, result.message);
  });
}

module.exports = new UserController();
