const VehicleListing = require('../../models/VehicleListing');
const ParentVehicle = require('../../models/ParentVehicle');
const Vendor = require('../../models/Vendor');
const ApiError = require('../../utils/ApiError');
const { LISTING_STATUS, APPROVAL_STATUS, ROLES } = require('../../config/constants');
const parentVehicleService = require('../vehicles/parentVehicle.service');

class VehicleListingService {
  async create(data, user) {
    // Validate parent vehicle exists
    const parent = await ParentVehicle.findOne({ _id: data.parent_vehicle_id, deleted_at: null });
    if (!parent) throw ApiError.notFound('Parent vehicle not found');

    // Validate vendor exists
    const vendor = await Vendor.findOne({ _id: data.vendor_id, deleted_at: null });
    if (!vendor) throw ApiError.notFound('Vendor not found');

    const listingData = {
      ...data,
      created_by: user._id,
    };

    // Auto-approve if created by admin
    if (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN) {
      listingData.verification = {
        is_verified: true,
        verified_by_user_id: user._id,
        verified_at: new Date(),
        approval_status: APPROVAL_STATUS.APPROVED,
        approval_notes: 'System auto-approved (Admin created)',
      };
      // If admin creates it, we can also default it to ACTIVE if requested
      if (!listingData.availability_status) {
        listingData.availability_status = LISTING_STATUS.ACTIVE;
      }
    }

    const listing = await VehicleListing.create(listingData);

    // Recalculate parent pricing if listing is active
    if (listing.availability_status === LISTING_STATUS.ACTIVE) {
      await parentVehicleService.recalculatePricing(listing.parent_vehicle_id);
    }

    return listing.toJSON();
  }

  async getAll(query) {
    const { page = 1, limit = 20, parent_vehicle_id, vendor_id, availability_status, search } = query;
    const skip = (page - 1) * limit;

    const filter = { deleted_at: null };
    if (parent_vehicle_id) filter.parent_vehicle_id = parent_vehicle_id;
    if (vendor_id) filter.vendor_id = vendor_id;
    if (availability_status) filter.availability_status = availability_status;
    if (search) {
      filter.listing_title_override = { $regex: search, $options: 'i' };
    }

    const [listings, total] = await Promise.all([
      VehicleListing.find(filter)
        .populate('parent_vehicle_id', 'display_name brand model slug')
        .populate('vendor_id', 'company_name vendor_code vendor_type contact_person_phone whatsapp_number contact_person_email')
        .sort({ own_fleet_priority: -1, created_at: -1 })
        .skip(skip)
        .limit(limit),
      VehicleListing.countDocuments(filter),
    ]);

    return {
      listings,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const listing = await VehicleListing.findOne({ _id: id, deleted_at: null })
      .populate('parent_vehicle_id', 'display_name brand model slug')
      .populate('vendor_id', 'company_name vendor_code vendor_type contact_person_phone whatsapp_number contact_person_email');

    if (!listing) throw ApiError.notFound('Vehicle listing not found');
    return listing;
  }

  async update(id, data, updatedBy) {
    const listing = await VehicleListing.findOne({ _id: id, deleted_at: null });
    if (!listing) throw ApiError.notFound('Vehicle listing not found');

    // Deep merge nested objects
    if (data.pricing) data.pricing = { ...listing.pricing?.toObject?.() || {}, ...data.pricing };
    if (data.chauffeur) data.chauffeur = { ...listing.chauffeur?.toObject?.() || {}, ...data.chauffeur };
    if (data.source) data.source = { ...listing.source?.toObject?.() || {}, ...data.source };

    Object.assign(listing, data, { updated_by: updatedBy });
    await listing.save();

    // Recalculate parent pricing
    await parentVehicleService.recalculatePricing(listing.parent_vehicle_id);

    return listing.toJSON();
  }

  async updateStatus(id, availability_status, updatedBy) {
    const listing = await VehicleListing.findOne({ _id: id, deleted_at: null });
    if (!listing) throw ApiError.notFound('Vehicle listing not found');

    listing.availability_status = availability_status;
    listing.updated_by = updatedBy;
    await listing.save();

    // Recalculate parent pricing on status change
    await parentVehicleService.recalculatePricing(listing.parent_vehicle_id);

    return listing.toJSON();
  }

  async approve(id, approvalNotes, approvedBy) {
    const listing = await VehicleListing.findOne({ _id: id, deleted_at: null });
    if (!listing) throw ApiError.notFound('Vehicle listing not found');

    listing.verification.is_verified = true;
    listing.verification.verified_by_user_id = approvedBy;
    listing.verification.verified_at = new Date();
    listing.verification.approval_status = APPROVAL_STATUS.APPROVED;
    listing.verification.approval_notes = approvalNotes || null;
    listing.availability_status = LISTING_STATUS.ACTIVE;
    listing.updated_by = approvedBy;

    await listing.save();
    await parentVehicleService.recalculatePricing(listing.parent_vehicle_id);

    return listing.toJSON();
  }

  async reject(id, approvalNotes, rejectedBy) {
    const listing = await VehicleListing.findOne({ _id: id, deleted_at: null });
    if (!listing) throw ApiError.notFound('Vehicle listing not found');

    listing.verification.approval_status = APPROVAL_STATUS.REJECTED;
    listing.verification.approval_notes = approvalNotes || null;
    listing.availability_status = LISTING_STATUS.REJECTED;
    listing.updated_by = rejectedBy;

    await listing.save();
    await parentVehicleService.recalculatePricing(listing.parent_vehicle_id);

    return listing.toJSON();
  }
}

module.exports = new VehicleListingService();
