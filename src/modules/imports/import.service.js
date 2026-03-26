const { parse } = require('csv-parse');
const { Readable } = require('stream');
const slugify = require('slugify');
const ParentVehicle = require('../../models/ParentVehicle');
const VehicleListing = require('../../models/VehicleListing');
const Vendor = require('../../models/Vendor');
const ApiError = require('../../utils/ApiError');
const { LISTING_STATUS, SOURCE_TYPE } = require('../../config/constants');

class ImportService {
  /**
   * Parse CSV buffer into records.
   */
  async parseCSV(buffer) {
    return new Promise((resolve, reject) => {
      const records = [];
      const stream = Readable.from(buffer);
      stream
        .pipe(
          parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true,
          })
        )
        .on('data', (row) => records.push(row))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(records));
    });
  }

  /**
   * Import vehicles from CSV.
   * Deduplicates parent vehicles by brand + model + model_year + variant + category.
   */
  async importVehiclesCSV(fileBuffer, createdBy) {
    let records;
    try {
      records = await this.parseCSV(fileBuffer);
    } catch {
      throw ApiError.badRequest('Failed to parse CSV file. Please check the format.');
    }

    if (!records.length) {
      throw ApiError.badRequest('CSV file is empty');
    }

    const report = {
      total_rows: records.length,
      success: 0,
      failed: 0,
      errors: [],
      created_parents: 0,
      created_listings: 0,
      matched_parents: 0,
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 2; // +2 for header + 0-index

      try {
        // Validate required fields
        if (!row.brand || !row.model) {
          report.errors.push({ row: rowNum, message: 'Missing required field: brand or model' });
          report.failed++;
          continue;
        }

        // Find or create parent vehicle
        const parentFilter = {
          brand: { $regex: `^${row.brand.trim()}$`, $options: 'i' },
          model: { $regex: `^${row.model.trim()}$`, $options: 'i' },
          deleted_at: null,
        };

        if (row.model_year) parentFilter.model_year = Number(row.model_year);
        if (row.variant) parentFilter.variant = { $regex: `^${row.variant.trim()}$`, $options: 'i' };
        if (row.category) parentFilter.category = { $regex: `^${row.category.trim()}$`, $options: 'i' };

        let parent = await ParentVehicle.findOne(parentFilter);

        if (!parent) {
          const displayName = `${row.brand} ${row.model}${row.variant ? ' ' + row.variant : ''}`;
          let slug = slugify(displayName, { lower: true, strict: true });
          const existingSlug = await ParentVehicle.findOne({ slug });
          if (existingSlug) slug = `${slug}-${Date.now()}`;

          parent = await ParentVehicle.create({
            slug,
            display_name: displayName,
            brand: row.brand.trim(),
            model: row.model.trim(),
            variant: row.variant?.trim() || null,
            model_year: row.model_year ? Number(row.model_year) : null,
            category: row.category?.trim() || null,
            description: row.description?.trim() || null,
            specs: {
              passengers: row.passengers ? Number(row.passengers) : null,
              luggage: row.luggage ? Number(row.luggage) : null,
              transmission: row.transmission?.trim() || null,
              doors: row.doors ? Number(row.doors) : null,
              engine: row.engine?.trim() || null,
              fuel_type: row.fuel_type?.trim() || null,
            },
            created_by: createdBy,
          });

          report.created_parents++;
        } else {
          report.matched_parents++;
        }

        // Find vendor
        let vendor = null;
        if (row.vendor_code) {
          vendor = await Vendor.findOne({ vendor_code: row.vendor_code, deleted_at: null });
        } else if (row.vendor_company_name) {
          vendor = await Vendor.findOne({
            company_name: { $regex: `^${row.vendor_company_name.trim()}$`, $options: 'i' },
            deleted_at: null,
          });
        }

        if (!vendor) {
          report.errors.push({ row: rowNum, message: 'Vendor not found. Listing skipped.' });
          report.failed++;
          continue;
        }

        // Create child listing
        await VehicleListing.create({
          parent_vehicle_id: parent._id,
          vendor_id: vendor._id,
          pricing: {
            vendor_base_price_per_day: row.vendor_base_price ? Number(row.vendor_base_price) : null,
            website_selling_price_per_day: row.selling_price ? Number(row.selling_price) : null,
            display_price_candidate_per_day: row.display_price ? Number(row.display_price) : null,
            weekly_price: row.weekly_price ? Number(row.weekly_price) : null,
            monthly_price: row.monthly_price ? Number(row.monthly_price) : null,
          },
          chauffeur: {
            driver_available: row.driver_available === 'true' || row.driver_available === '1',
            driver_price_per_day: row.driver_price ? Number(row.driver_price) : null,
          },
          availability_status: row.status || LISTING_STATUS.DRAFT,
          source: {
            source_type: SOURCE_TYPE.CSV,
            source_reference: `CSV import row ${rowNum}`,
          },
          internal_notes: row.notes?.trim() || null,
          created_by: createdBy,
        });

        report.created_listings++;
        report.success++;
      } catch (error) {
        report.errors.push({ row: rowNum, message: error.message });
        report.failed++;
      }
    }

    return report;
  }
}

module.exports = new ImportService();
