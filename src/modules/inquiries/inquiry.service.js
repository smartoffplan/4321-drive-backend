const InquiryLog = require('../../models/InquiryLog');
const ParentVehicle = require('../../models/ParentVehicle');
const ApiError = require('../../utils/ApiError');

class InquiryService {
  async logWhatsAppClick(data) {
    // Validate parent vehicle exists
    const parent = await ParentVehicle.findById(data.parent_vehicle_id);
    if (!parent) throw ApiError.notFound('Parent vehicle not found');

    const inquiry = await InquiryLog.create(data);
    return inquiry.toJSON();
  }

  async getAll(query) {
    const { page = 1, limit = 20, parent_vehicle_id } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (parent_vehicle_id) filter.parent_vehicle_id = parent_vehicle_id;

    const [inquiries, total] = await Promise.all([
      InquiryLog.find(filter)
        .populate('parent_vehicle_id', 'display_name brand model slug')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      InquiryLog.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    };
  }

  async getSummary() {
    const [total, last7Days, byVehicle] = await Promise.all([
      InquiryLog.countDocuments(),

      InquiryLog.countDocuments({
        created_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),

      InquiryLog.aggregate([
        {
          $group: {
            _id: '$parent_vehicle_id',
            count: { $sum: 1 },
            last_inquiry: { $max: '$created_at' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'parentvehicles',
            localField: '_id',
            foreignField: '_id',
            as: 'vehicle',
          },
        },
        { $unwind: '$vehicle' },
        {
          $project: {
            _id: 1,
            count: 1,
            last_inquiry: 1,
            vehicle_name: '$vehicle.display_name',
            brand: '$vehicle.brand',
            model: '$vehicle.model',
          },
        },
      ]),
    ]);

    return { total, last_7_days: last7Days, top_vehicles: byVehicle };
  }
}

module.exports = new InquiryService();
