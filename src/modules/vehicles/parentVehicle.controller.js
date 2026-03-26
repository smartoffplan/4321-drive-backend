const parentVehicleService = require('./parentVehicle.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class ParentVehicleController {
  create = asyncHandler(async (req, res) => {
    const vehicle = await parentVehicleService.create(req.body, req.user._id);
    ApiResponse.created(res, 'Parent vehicle created successfully', vehicle);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await parentVehicleService.getAll(req.query);
    ApiResponse.paginated(res, 'Parent vehicles retrieved', result.vehicles, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const vehicle = await parentVehicleService.getById(req.params.id);
    ApiResponse.success(res, 'Parent vehicle retrieved', vehicle);
  });

  update = asyncHandler(async (req, res) => {
    const vehicle = await parentVehicleService.update(req.params.id, req.body, req.user._id);
    ApiResponse.success(res, 'Parent vehicle updated', vehicle);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const vehicle = await parentVehicleService.updateStatus(req.params.id, req.body.public_status, req.user._id);
    ApiResponse.success(res, 'Vehicle status updated', vehicle);
  });

  updateDisplayPrice = asyncHandler(async (req, res) => {
    const vehicle = await parentVehicleService.updateDisplayPrice(req.params.id, req.body, req.user._id);
    ApiResponse.success(res, 'Display price updated', vehicle);
  });
}

module.exports = new ParentVehicleController();
