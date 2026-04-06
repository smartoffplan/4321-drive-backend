const InquiryLog = require("../../models/InquiryLog");
const ParentVehicle = require("../../models/ParentVehicle");
const ApiError = require("../../utils/ApiError");

class InquiryService {
  // Legacy WhatsApp click log
  async logWhatsAppClick(data) {
    const parent = await ParentVehicle.findById(data.parent_vehicle_id);
    if (!parent) throw ApiError.notFound("Parent vehicle not found");

    const inquiry = await InquiryLog.create({
      ...data,
      source_action: "whatsapp_click",
      driver_selected: data.driver_selected ?? false,
    });
    return inquiry.toJSON();
  }

  // New: public booking form submission
  async submitBookingInquiry(data) {
    const parent = await ParentVehicle.findById(data.parent_vehicle_id);
    if (!parent) throw ApiError.notFound("Vehicle not found");

    const payload = {
      parent_vehicle_id: data.parent_vehicle_id,
      source_action: "booking_form",
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      drive_mode: data.drive_mode,
      chauffeur_type:
        data.drive_mode === "chauffeur" ? data.chauffeur_type : null,
      service_type: data.drive_mode === "chauffeur" ? data.service_type : null,
      language_preference:
        data.drive_mode === "chauffeur" ? data.language_preference : null,
      pickup_location: data.pickup_location || null,
      pickup_date: data.pickup_date || null,
      pickup_time: data.pickup_time || null,
      return_date: data.return_date || null,
      return_time: data.return_time || null,
      special_instructions: data.special_instructions || null,
      base_daily_price: data.base_daily_price ?? null,
      chauffeur_fee: data.chauffeur_fee ?? 0,
      total_daily_price: data.total_daily_price ?? null,
      driver_selected: data.drive_mode === "chauffeur",
      page_type: data.page_type || null,
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      status: "new",
    };

    const inquiry = await InquiryLog.create(payload);
    return inquiry.toJSON();
  }

  async getAll(query) {
    const { page = 1, limit = 20, parent_vehicle_id, status, search } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (parent_vehicle_id) filter.parent_vehicle_id = parent_vehicle_id;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { customer_name: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { customer_phone: { $regex: search, $options: "i" } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      InquiryLog.find(filter)
        .populate("parent_vehicle_id", "display_name brand model slug")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InquiryLog.countDocuments(filter),
    ]);

    return {
      inquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const inquiry = await InquiryLog.findById(id).populate(
      "parent_vehicle_id",
      "display_name brand model slug images",
    );
    if (!inquiry) throw ApiError.notFound("Inquiry not found");
    return inquiry.toJSON();
  }

  async updateInquiry(id, data) {
    const inquiry = await InquiryLog.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).populate("parent_vehicle_id", "display_name brand model slug");
    if (!inquiry) throw ApiError.notFound("Inquiry not found");
    return inquiry.toJSON();
  }

  async getSummary() {
    const [total, last7Days, byVehicle, byStatus] = await Promise.all([
      InquiryLog.countDocuments(),

      InquiryLog.countDocuments({
        created_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),

      InquiryLog.aggregate([
        {
          $group: {
            _id: "$parent_vehicle_id",
            count: { $sum: 1 },
            last_inquiry: { $max: "$created_at" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "parentvehicles",
            localField: "_id",
            foreignField: "_id",
            as: "vehicle",
          },
        },
        { $unwind: "$vehicle" },
        {
          $project: {
            _id: 1,
            count: 1,
            last_inquiry: 1,
            vehicle_name: "$vehicle.display_name",
            brand: "$vehicle.brand",
            model: "$vehicle.model",
          },
        },
      ]),

      InquiryLog.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      last_7_days: last7Days,
      top_vehicles: byVehicle,
      by_status: byStatus,
    };
  }
}

module.exports = new InquiryService();
