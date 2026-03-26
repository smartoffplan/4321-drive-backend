const publicService = require('./public.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

class PublicController {
  getVehicles = asyncHandler(async (req, res) => {
    const result = await publicService.getPublicVehicles(req.query);
    ApiResponse.paginated(res, 'Vehicles retrieved', result.vehicles, result.pagination);
  });

  getVehicleBySlug = asyncHandler(async (req, res) => {
    const vehicle = await publicService.getPublicVehicleBySlug(req.params.slug);
    if (!vehicle) throw ApiError.notFound('Vehicle not found');
    ApiResponse.success(res, 'Vehicle retrieved', vehicle);
  });
}

module.exports = new PublicController();
