const vehicleListingService = require('./vehicleListing.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class VehicleListingController {
  create = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.create(req.body, req.user);
    ApiResponse.created(res, 'Vehicle listing created successfully', listing);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await vehicleListingService.getAll(req.query);
    ApiResponse.paginated(res, 'Vehicle listings retrieved', result.listings, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.getById(req.params.id);
    ApiResponse.success(res, 'Vehicle listing retrieved', listing);
  });

  update = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.update(req.params.id, req.body, req.user._id);
    ApiResponse.success(res, 'Vehicle listing updated', listing);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.updateStatus(req.params.id, req.body.availability_status, req.user._id);
    ApiResponse.success(res, 'Listing status updated', listing);
  });

  approve = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.approve(req.params.id, req.body.approval_notes, req.user._id);
    ApiResponse.success(res, 'Listing approved', listing);
  });

  reject = asyncHandler(async (req, res) => {
    const listing = await vehicleListingService.reject(req.params.id, req.body.approval_notes, req.user._id);
    ApiResponse.success(res, 'Listing rejected', listing);
  });
}

module.exports = new VehicleListingController();
