const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

    ApiResponse.created(res, 'Account created successfully', result);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    ApiResponse.success(res, 'Login successful', result);
  });

  refresh = asyncHandler(async (req, res) => {
    const { refresh_token } = req.body;
    const tokens = await authService.refreshToken(refresh_token);

    ApiResponse.success(res, 'Token refreshed successfully', tokens);
  });

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);
    ApiResponse.success(res, 'Logged out successfully');
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user._id);
    ApiResponse.success(res, 'User profile retrieved', user);
  });
}

module.exports = new AuthController();
