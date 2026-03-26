const vendorService = require('./vendor.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class VendorController {
  create = asyncHandler(async (req, res) => {
    const vendor = await vendorService.create(req.body, req.user._id);
    ApiResponse.created(res, 'Vendor created successfully', vendor);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await vendorService.getAll(req.query);
    ApiResponse.paginated(res, 'Vendors retrieved successfully', result.vendors, result.pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const vendor = await vendorService.getById(req.params.id);
    ApiResponse.success(res, 'Vendor retrieved successfully', vendor);
  });

  update = asyncHandler(async (req, res) => {
    const vendor = await vendorService.update(req.params.id, req.body, req.user._id);
    ApiResponse.success(res, 'Vendor updated successfully', vendor);
  });

  updateStatus = asyncHandler(async (req, res) => {
    const vendor = await vendorService.updateStatus(req.params.id, req.body.status, req.user._id);
    ApiResponse.success(res, 'Vendor status updated successfully', vendor);
  });

  getVendorListings = asyncHandler(async (req, res) => {
    const result = await vendorService.getVendorListings(req.params.id, req.query);
    ApiResponse.paginated(res, 'Vendor listings retrieved', result.listings, result.pagination);
  });
}

module.exports = new VendorController();
