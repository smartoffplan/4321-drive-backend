const { Router } = require('express');
const parentVehicleController = require('./parentVehicle.controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const P = require('../../permissions/permissions');
const {
  createParentVehicleSchema,
  updateParentVehicleSchema,
  updateStatusSchema,
  updateDisplayPriceSchema,
  vehiclesQuerySchema,
  idParamSchema,
} = require('./parentVehicle.validation');

const router = Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Parent Vehicles
 *   description: Public parent vehicle catalog management
 */

/**
 * @swagger
 * /vehicles/parents:
 *   post:
 *     summary: Create a parent vehicle
 *     tags: [Parent Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [display_name, brand, model]
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Audi A8
 *               brand:
 *                 type: string
 *                 example: Audi
 *               model:
 *                 type: string
 *                 example: A8
 *               variant:
 *                 type: string
 *                 example: L
 *               model_year:
 *                 type: integer
 *                 example: 2024
 *               category:
 *                 type: string
 *                 example: Luxury Sedan
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [luxury, sedan]
 *               location_default:
 *                 type: string
 *                 example: Dubai
 *               main_image:
 *                 type: string
 *               gallery_images:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               long_description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               highlights:
 *                 type: array
 *                 items:
 *                   type: string
 *               why_choose:
 *                 type: array
 *                 items:
 *                   type: string
 *               specs:
 *                 type: object
 *                 properties:
 *                   passengers:
 *                     type: integer
 *                     example: 5
 *                   luggage:
 *                     type: integer
 *                     example: 3
 *                   transmission:
 *                     type: string
 *                     example: Automatic
 *                   doors:
 *                     type: integer
 *                     example: 4
 *                   engine:
 *                     type: string
 *                     example: 4.0L V8 Twin Turbo
 *                   fuel_type:
 *                     type: string
 *                     example: Petrol
 *                   horsepower:
 *                     type: string
 *                     example: 460 HP
 *                   acceleration:
 *                     type: string
 *                     example: 4.4s 0-100 km/h
 *                   top_speed:
 *                     type: string
 *                     example: 250 km/h
 *                   drive_type:
 *                     type: string
 *                     example: AWD
 *               display_settings:
 *                 type: object
 *                 properties:
 *                   is_featured:
 *                     type: boolean
 *                     default: false
 *                   sort_priority:
 *                     type: integer
 *                     default: 0
 *                   show_on_frontend:
 *                     type: boolean
 *                     default: true
 *               public_status:
 *                 type: string
 *                 enum: [draft, active, inactive, archived]
 *                 default: draft
 *               seo:
 *                 type: object
 *                 properties:
 *                   meta_title:
 *                     type: string
 *                   meta_description:
 *                     type: string
 *                   canonical_url:
 *                     type: string
 *     responses:
 *       201:
 *         description: Parent vehicle created
 */
router.post('/', authorize(P.VEHICLES_PARENT_CREATE), validate(createParentVehicleSchema), parentVehicleController.create);

/**
 * @swagger
 * /vehicles/parents:
 *   get:
 *     summary: List parent vehicles
 *     tags: [Parent Vehicles]
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
 *         name: public_status
 *         schema:
 *           type: string
 *           enum: [draft, active, inactive, archived]
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, brand, or model
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [created_at, display_name, sort_priority, public_starting_price]
 *           default: created_at
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Vehicles retrieved
 */
router.get('/', authorize(P.VEHICLES_PARENT_READ), validate(vehiclesQuerySchema), parentVehicleController.getAll);

/**
 * @swagger
 * /vehicles/parents/{id}:
 *   get:
 *     summary: Get parent vehicle by ID
 *     tags: [Parent Vehicles]
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
 *         description: Vehicle retrieved
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', authorize(P.VEHICLES_PARENT_READ), validate(idParamSchema), parentVehicleController.getById);

/**
 * @swagger
 * /vehicles/parents/{id}:
 *   patch:
 *     summary: Update parent vehicle
 *     tags: [Parent Vehicles]
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
 *               display_name:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               specs:
 *                 type: object
 *               display_settings:
 *                 type: object
 *               seo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Vehicle not found
 */
router.patch('/:id', authorize(P.VEHICLES_PARENT_UPDATE), validate(updateParentVehicleSchema), parentVehicleController.update);

/**
 * @swagger
 * /vehicles/parents/{id}/status:
 *   patch:
 *     summary: Update vehicle public status
 *     tags: [Parent Vehicles]
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
 *             required: [public_status]
 *             properties:
 *               public_status:
 *                 type: string
 *                 enum: [draft, active, inactive, archived]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authorize(P.VEHICLES_PARENT_DISABLE), validate(updateStatusSchema), parentVehicleController.updateStatus);

/**
 * @swagger
 * /vehicles/parents/{id}/display-price:
 *   patch:
 *     summary: Update display price settings
 *     description: Controls the public-facing price shown on frontend. Can be auto-calculated from cheapest child listing or manually overridden.
 *     tags: [Parent Vehicles]
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
 *             required: [display_price_mode]
 *             properties:
 *               display_price_mode:
 *                 type: string
 *                 enum: [auto_min_child_price, manual_override, preferred_vendor_price]
 *                 example: manual_override
 *               display_price_override:
 *                 type: number
 *                 example: 2000
 *               weekly_price_public:
 *                 type: number
 *                 example: 12000
 *               monthly_price_public:
 *                 type: number
 *                 example: 45000
 *     responses:
 *       200:
 *         description: Display price updated
 */
router.patch('/:id/display-price', authorize(P.PRICING_UPDATE_DISPLAY), validate(updateDisplayPriceSchema), parentVehicleController.updateDisplayPrice);

module.exports = router;
