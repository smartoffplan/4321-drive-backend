const Vendor = require('../../models/Vendor');
const VehicleListing = require('../../models/VehicleListing');
const ApiError = require('../../utils/ApiError');

class VendorService {
  async create(data, createdBy) {
    const vendor = await Vendor.create({
      ...data,
      created_by: createdBy,
    });
    return vendor.toJSON();
  }

  async getAll(query) {
    const { page = 1, limit = 20, status, vendor_type, search } = query;
    const skip = (page - 1) * limit;

    const filter = { deleted_at: null };
    if (status) filter.status = status;
    if (vendor_type) filter.vendor_type = vendor_type;
    if (search) {
      filter.$or = [
        { company_name: { $regex: search, $options: 'i' } },
        { contact_person_name: { $regex: search, $options: 'i' } },
        { vendor_code: { $regex: search, $options: 'i' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      Vendor.find(filter).sort({ is_priority_vendor: -1, priority_rank: -1, created_at: -1 }).skip(skip).limit(limit),
      Vendor.countDocuments(filter),
    ]);

    return {
      vendors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const vendor = await Vendor.findOne({ _id: id, deleted_at: null });
    if (!vendor) throw ApiError.notFound('Vendor not found');
    return vendor;
  }

  async update(id, data, updatedBy) {
    const vendor = await Vendor.findOne({ _id: id, deleted_at: null });
    if (!vendor) throw ApiError.notFound('Vendor not found');

    Object.assign(vendor, data, { updated_by: updatedBy });
    await vendor.save();
    return vendor.toJSON();
  }

  async updateStatus(id, status, updatedBy) {
    const vendor = await Vendor.findOne({ _id: id, deleted_at: null });
    if (!vendor) throw ApiError.notFound('Vendor not found');

    vendor.status = status;
    vendor.updated_by = updatedBy;
    await vendor.save();
    return vendor.toJSON();
  }

  async getVendorListings(vendorId, query) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const vendor = await Vendor.findOne({ _id: vendorId, deleted_at: null });
    if (!vendor) throw ApiError.notFound('Vendor not found');

    const filter = { vendor_id: vendorId, deleted_at: null };

    const [listings, total] = await Promise.all([
      VehicleListing.find(filter)
        .populate('parent_vehicle_id', 'display_name brand model slug')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      VehicleListing.countDocuments(filter),
    ]);

    return {
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new VendorService();
