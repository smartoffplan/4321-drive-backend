const inquiryService = require('./inquiry.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class InquiryController {
  logWhatsAppClick = asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.logWhatsAppClick(req.body);
    ApiResponse.created(res, 'Inquiry logged successfully', inquiry);
  });

  getAll = asyncHandler(async (req, res) => {
    const result = await inquiryService.getAll(req.query);
    ApiResponse.paginated(res, 'Inquiries retrieved', result.inquiries, result.pagination);
  });

  getSummary = asyncHandler(async (_req, res) => {
    const summary = await inquiryService.getSummary();
    ApiResponse.success(res, 'Inquiry summary retrieved', summary);
  });
}

module.exports = new InquiryController();
