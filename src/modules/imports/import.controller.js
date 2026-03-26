const importService = require('./import.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');

class ImportController {
  importVehiclesCSV = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('CSV file is required');
    }

    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      throw ApiError.badRequest('Only CSV files are allowed');
    }

    const report = await importService.importVehiclesCSV(req.file.buffer, req.user._id);
    ApiResponse.success(res, 'CSV import completed', report);
  });
}

module.exports = new ImportController();
