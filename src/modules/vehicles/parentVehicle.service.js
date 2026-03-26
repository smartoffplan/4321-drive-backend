const slugify = require('slugify');
const ParentVehicle = require('../../models/ParentVehicle');
const VehicleListing = require('../../models/VehicleListing');
const ApiError = require('../../utils/ApiError');
const { PRICING_MODE, LISTING_STATUS } = require('../../config/constants');

class ParentVehicleService {
  /**
   * Generate a unique slug from display name.
   */
  async generateSlug(displayName) {
    let slug = slugify(displayName, { lower: true, strict: true });
    const existing = await ParentVehicle.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    return slug;
  }

  /**
   * Recalculate pricing summary from active child listings.
   */
  async recalculatePricing(parentVehicleId) {
    const vehicle = await ParentVehicle.findById(parentVehicleId);
    if (!vehicle) return;

    const activeListings = await VehicleListing.find({
      parent_vehicle_id: parentVehicleId,
      availability_status: LISTING_STATUS.ACTIVE,
      deleted_at: null,
      'pricing.website_selling_price_per_day': { $gt: 0 },
    }).sort({ 'pricing.website_selling_price_per_day': 1 });

    if (activeListings.length === 0) {
      vehicle.pricing_summary.calculated_min_daily_price = null;
      vehicle.pricing_summary.price_source_child_listing_id = null;
    } else {
      const cheapest = activeListings[0];
      vehicle.pricing_summary.calculated_min_daily_price = cheapest.pricing.website_selling_price_per_day;
      vehicle.pricing_summary.price_source_child_listing_id = cheapest._id;
    }

    // Determine public starting price based on mode
    const mode = vehicle.pricing_summary.display_price_mode;

    if (mode === PRICING_MODE.MANUAL_OVERRIDE && vehicle.pricing_summary.display_price_override != null) {
      vehicle.pricing_summary.public_starting_price = vehicle.pricing_summary.display_price_override;
    } else {
      vehicle.pricing_summary.public_starting_price = vehicle.pricing_summary.calculated_min_daily_price;
    }

    await vehicle.save({ validateBeforeSave: false });
    return vehicle;
  }

  async create(data, createdBy) {
    const slug = await this.generateSlug(data.display_name);

    const vehicle = await ParentVehicle.create({
      ...data,
      slug,
      created_by: createdBy,
    });

    return vehicle.toJSON();
  }

  async getAll(query) {
    const { page = 1, limit = 20, public_status, brand, category, is_featured, search, sort_by = 'created_at', sort_order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter = { deleted_at: null };
    if (public_status) filter.public_status = public_status;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (is_featured !== undefined) filter['display_settings.is_featured'] = is_featured;
    if (search) {
      filter.$or = [
        { display_name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj = {};
    if (sort_by === 'public_starting_price') {
      sortObj['pricing_summary.public_starting_price'] = sort_order === 'asc' ? 1 : -1;
    } else if (sort_by === 'sort_priority') {
      sortObj['display_settings.sort_priority'] = sort_order === 'asc' ? 1 : -1;
    } else {
      sortObj[sort_by] = sort_order === 'asc' ? 1 : -1;
    }

    const [vehicles, total] = await Promise.all([
      ParentVehicle.find(filter).sort(sortObj).skip(skip).limit(limit),
      ParentVehicle.countDocuments(filter),
    ]);

    return {
      vehicles,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const vehicle = await ParentVehicle.findOne({ _id: id, deleted_at: null });
    if (!vehicle) throw ApiError.notFound('Parent vehicle not found');
    return vehicle;
  }

  async update(id, data, updatedBy) {
    const vehicle = await ParentVehicle.findOne({ _id: id, deleted_at: null });
    if (!vehicle) throw ApiError.notFound('Parent vehicle not found');

    // Regenerate slug if display_name changed
    if (data.display_name && data.display_name !== vehicle.display_name) {
      data.slug = await this.generateSlug(data.display_name);
    }

    // Deep merge for nested objects
    if (data.specs) data.specs = { ...vehicle.specs?.toObject?.() || {}, ...data.specs };
    if (data.display_settings) data.display_settings = { ...vehicle.display_settings?.toObject?.() || {}, ...data.display_settings };
    if (data.seo) data.seo = { ...vehicle.seo?.toObject?.() || {}, ...data.seo };

    Object.assign(vehicle, data, { updated_by: updatedBy });
    await vehicle.save();
    return vehicle.toJSON();
  }

  async updateStatus(id, public_status, updatedBy) {
    const vehicle = await ParentVehicle.findOne({ _id: id, deleted_at: null });
    if (!vehicle) throw ApiError.notFound('Parent vehicle not found');

    vehicle.public_status = public_status;
    vehicle.updated_by = updatedBy;
    await vehicle.save();
    return vehicle.toJSON();
  }

  async updateDisplayPrice(id, data, updatedBy) {
    const vehicle = await ParentVehicle.findOne({ _id: id, deleted_at: null });
    if (!vehicle) throw ApiError.notFound('Parent vehicle not found');

    vehicle.pricing_summary.display_price_mode = data.display_price_mode;
    if (data.display_price_override !== undefined) {
      vehicle.pricing_summary.display_price_override = data.display_price_override;
    }
    if (data.weekly_price_public !== undefined) {
      vehicle.pricing_summary.weekly_price_public = data.weekly_price_public;
    }
    if (data.monthly_price_public !== undefined) {
      vehicle.pricing_summary.monthly_price_public = data.monthly_price_public;
    }
    vehicle.updated_by = updatedBy;

    // recalculate public price
    await vehicle.save();
    const updated = await this.recalculatePricing(id);
    return updated.toJSON();
  }
}

module.exports = new ParentVehicleService();
