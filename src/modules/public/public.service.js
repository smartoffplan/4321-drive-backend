const ParentVehicle = require('../../models/ParentVehicle');
const { PARENT_VEHICLE_STATUS } = require('../../config/constants');

class PublicService {
  /**
   * Get public vehicle listings for frontend.
   * Only returns active vehicles with public-safe fields.
   */
  async getPublicVehicles(query) {
    const { page = 1, limit = 20, brand, category, search, location, make, is_featured, sort_by = 'sort_priority', sort_order = 'desc' } = query;
    const skip = (page - 1) * limit;

    const filter = {
      public_status: PARENT_VEHICLE_STATUS.ACTIVE,
      'display_settings.show_on_frontend': true,
      deleted_at: null,
    };

    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (location) filter.location_default = { $regex: location, $options: 'i' };
    if (make) filter.model = { $regex: make, $options: 'i' };
    if (is_featured !== undefined) {
      filter['display_settings.is_featured'] = is_featured === true || is_featured === 'true';
    }

    if (search) {
      filter.$or = [
        { display_name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Public-safe fields only — no vendor data, no internal pricing
    const publicFields = [
      'slug', 'display_name', 'brand', 'model', 'variant', 'model_year',
      'category', 'tags', 'location_default', 'main_image', 'gallery_images', 'thumbnail',
      'description', 'long_description', 'features', 'highlights', 'why_choose',
      'specs', 'display_settings.is_featured', 'display_settings.sort_priority',
      'pricing_summary.public_starting_price', 'pricing_summary.weekly_price_public',
      'pricing_summary.monthly_price_public',
      'seo',
    ].join(' ');

    const sortObj = {};
    if (sort_by === 'price') {
      sortObj['pricing_summary.public_starting_price'] = sort_order === 'asc' ? 1 : -1;
    } else {
      sortObj['display_settings.is_featured'] = -1;
      sortObj['display_settings.sort_priority'] = -1;
      sortObj.created_at = -1;
    }

    const [vehicles, total] = await Promise.all([
      ParentVehicle.find(filter).select(publicFields).sort(sortObj).skip(skip).limit(limit),
      ParentVehicle.countDocuments(filter),
    ]);

    return {
      vehicles,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get single public vehicle by slug.
   */
  async getPublicVehicleBySlug(slug) {
    const vehicle = await ParentVehicle.findOne({
      slug,
      public_status: PARENT_VEHICLE_STATUS.ACTIVE,
      'display_settings.show_on_frontend': true,
      deleted_at: null,
    }).select('-created_by -updated_by -deleted_at -pricing_summary.display_price_mode -pricing_summary.display_price_override -pricing_summary.calculated_min_daily_price -pricing_summary.price_source_child_listing_id');

    return vehicle;
  }
}

module.exports = new PublicService();
