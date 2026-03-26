const { Router } = require('express');
const multer = require('multer');
const importController = require('./import.controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const P = require('../../permissions/permissions');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

const router = Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Imports
 *   description: Bulk CSV import for vehicles and listings
 */

/**
 * @swagger
 * /imports/vehicles/csv:
 *   post:
 *     summary: Import vehicles from CSV file
 *     description: |
 *       Upload a CSV file to bulk import parent vehicles and child listings.
 *       Parent vehicles are deduplicated by brand + model + year + variant.
 *       Vendors are matched by vendor_code or vendor_company_name column.
 *
 *       **Required CSV columns:** brand, model
 *
 *       **Optional columns:** variant, model_year, category, description, passengers, luggage,
 *       transmission, doors, engine, fuel_type, vendor_code, vendor_company_name,
 *       vendor_base_price, selling_price, display_price, weekly_price, monthly_price,
 *       driver_available, driver_price, status, notes
 *     tags: [Imports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file (max 5MB)
 *     responses:
 *       200:
 *         description: Import completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_rows:
 *                       type: integer
 *                     success:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     created_parents:
 *                       type: integer
 *                     matched_parents:
 *                       type: integer
 *                     created_listings:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                           message:
 *                             type: string
 *       400:
 *         description: Invalid CSV file
 */
router.post(
  '/vehicles/csv',
  authorize(P.IMPORTS_CREATE),
  upload.single('file'),
  importController.importVehiclesCSV
);

module.exports = router;
