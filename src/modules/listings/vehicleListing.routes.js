const { Router } = require('express');
const vehicleListingController = require('./vehicleListing.controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const P = require('../../permissions/permissions');
const {
  createListingSchema,
  updateListingSchema,
  updateListingStatusSchema,
  approveRejectSchema,
  listingsQuerySchema,
  idParamSchema,
} = require('./vehicleListing.validation');

const router = Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Vehicle Listings
 *   description: Vendor-specific child listings under parent vehicles
 */

/**
 * @swagger
 * /vehicle-listings:
 *   post:
 *     summary: Create a vehicle listing (child)
 *     description: Creates a vendor-specific listing linked to a parent vehicle. Recalculates parent pricing if listing is active.
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [parent_vehicle_id, vendor_id]
 *             properties:
 *               parent_vehicle_id:
 *                 type: string
 *                 description: ID of the parent vehicle
 *               vendor_id:
 *                 type: string
 *                 description: ID of the vendor
 *               listing_title_override:
 *                 type: string
 *                 example: Audi A8 - Premium Package
 *               own_fleet_priority:
 *                 type: boolean
 *                 default: false
 *               pricing:
 *                 type: object
 *                 properties:
 *                   vendor_base_price_per_day:
 *                     type: number
 *                     example: 1800
 *                   website_selling_price_per_day:
 *                     type: number
 *                     example: 2200
 *                   weekly_price:
 *                     type: number
 *                     example: 14000
 *                   monthly_price:
 *                     type: number
 *                     example: 50000
 *               pricing_unit_default:
 *                 type: string
 *                 enum: [day, hour, week, month]
 *                 default: day
 *               chauffeur:
 *                 type: object
 *                 properties:
 *                   driver_available:
 *                     type: boolean
 *                     default: false
 *                   driver_price_per_day:
 *                     type: number
 *                     example: 500
 *                   driver_notes:
 *                     type: string
 *               availability_status:
 *                 type: string
 *                 enum: [draft, pending_approval, active, temporarily_unavailable, booked, inactive, rejected, archived]
 *                 default: draft
 *               source:
 *                 type: object
 *                 properties:
 *                   source_type:
 *                     type: string
 *                     enum: [manual, csv, scrape, api_future]
 *                     default: manual
 *                   source_reference:
 *                     type: string
 *               internal_notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listing created
 *       404:
 *         description: Parent vehicle or vendor not found
 */
router.post('/', authorize(P.VEHICLES_CHILD_CREATE), validate(createListingSchema), vehicleListingController.create);

/**
 * @swagger
 * /vehicle-listings:
 *   get:
 *     summary: List vehicle listings
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: parent_vehicle_id
 *         schema:
 *           type: string
 *         description: Filter by parent vehicle
 *       - in: query
 *         name: vendor_id
 *         schema:
 *           type: string
 *         description: Filter by vendor
 *       - in: query
 *         name: availability_status
 *         schema:
 *           type: string
 *           enum: [draft, pending_approval, active, temporarily_unavailable, booked, inactive, rejected, archived]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by listing title
 *     responses:
 *       200:
 *         description: Listings retrieved
 */
router.get('/', authorize(P.VEHICLES_CHILD_READ), validate(listingsQuerySchema), vehicleListingController.getAll);

/**
 * @swagger
 * /vehicle-listings/{id}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing retrieved
 *       404:
 *         description: Listing not found
 */
router.get('/:id', authorize(P.VEHICLES_CHILD_READ), validate(idParamSchema), vehicleListingController.getById);

/**
 * @swagger
 * /vehicle-listings/{id}:
 *   patch:
 *     summary: Update listing
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listing_title_override:
 *                 type: string
 *               pricing:
 *                 type: object
 *               chauffeur:
 *                 type: object
 *               internal_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Listing updated
 *       404:
 *         description: Listing not found
 */
router.patch('/:id', authorize(P.VEHICLES_CHILD_UPDATE), validate(updateListingSchema), vehicleListingController.update);

/**
 * @swagger
 * /vehicle-listings/{id}/status:
 *   patch:
 *     summary: Update listing availability status
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [availability_status]
 *             properties:
 *               availability_status:
 *                 type: string
 *                 enum: [draft, pending_approval, active, temporarily_unavailable, booked, inactive, rejected, archived]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authorize(P.VEHICLES_CHILD_DISABLE), validate(updateListingStatusSchema), vehicleListingController.updateStatus);

/**
 * @swagger
 * /vehicle-listings/{id}/approve:
 *   patch:
 *     summary: Approve a listing
 *     description: Sets listing to active + approved. Recalculates parent vehicle pricing.
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approval_notes:
 *                 type: string
 *                 example: Verified and approved
 *     responses:
 *       200:
 *         description: Listing approved
 */
router.patch('/:id/approve', authorize(P.VEHICLES_CHILD_APPROVE), validate(approveRejectSchema), vehicleListingController.approve);

/**
 * @swagger
 * /vehicle-listings/{id}/reject:
 *   patch:
 *     summary: Reject a listing
 *     description: Sets listing to rejected status. Recalculates parent vehicle pricing.
 *     tags: [Vehicle Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approval_notes:
 *                 type: string
 *                 example: Price too high
 *     responses:
 *       200:
 *         description: Listing rejected
 */
router.patch('/:id/reject', authorize(P.VEHICLES_CHILD_APPROVE), validate(approveRejectSchema), vehicleListingController.reject);

module.exports = router;
