const { Router } = require('express');
const vendorController = require('./vendor.controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const P = require('../../permissions/permissions');
const {
  createVendorSchema,
  updateVendorSchema,
  updateVendorStatusSchema,
  vendorsQuerySchema,
  idParamSchema,
} = require('./vendor.validation');

const router = Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor management (own fleet + external vendors)
 */

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vendor_type, company_name]
 *             properties:
 *               vendor_type:
 *                 type: string
 *                 enum: [own_fleet, external_vendor]
 *                 example: external_vendor
 *               company_name:
 *                 type: string
 *                 example: Premium Cars LLC
 *               garage_name:
 *                 type: string
 *               contact_person_name:
 *                 type: string
 *                 example: Ahmed Ali
 *               contact_person_email:
 *                 type: string
 *                 format: email
 *               contact_person_phone:
 *                 type: string
 *               whatsapp_number:
 *                 type: string
 *               company_phone:
 *                 type: string
 *               address_line_1:
 *                 type: string
 *               city:
 *                 type: string
 *                 example: Dubai
 *               country:
 *                 type: string
 *                 default: UAE
 *               trade_license_number:
 *                 type: string
 *               tax_number:
 *                 type: string
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending_verification, blocked]
 *                 default: active
 *               priority_rank:
 *                 type: integer
 *                 default: 0
 *               is_priority_vendor:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Vendor created
 */
router.post('/', authorize(P.VENDORS_CREATE), validate(createVendorSchema), vendorController.create);

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: List all vendors
 *     tags: [Vendors]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending_verification, blocked]
 *       - in: query
 *         name: vendor_type
 *         schema:
 *           type: string
 *           enum: [own_fleet, external_vendor]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by company name, contact name, or vendor code
 *     responses:
 *       200:
 *         description: Vendors retrieved
 */
router.get('/', authorize(P.VENDORS_READ), validate(vendorsQuerySchema), vendorController.getAll);

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get vendor by ID
 *     tags: [Vendors]
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
 *         description: Vendor retrieved
 *       404:
 *         description: Vendor not found
 */
router.get('/:id', authorize(P.VENDORS_READ), validate(idParamSchema), vendorController.getById);

/**
 * @swagger
 * /vendors/{id}:
 *   patch:
 *     summary: Update vendor
 *     tags: [Vendors]
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
 *               company_name:
 *                 type: string
 *               contact_person_name:
 *                 type: string
 *               contact_person_email:
 *                 type: string
 *               contact_person_phone:
 *                 type: string
 *               notes:
 *                 type: string
 *               priority_rank:
 *                 type: integer
 *               is_priority_vendor:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vendor updated
 *       404:
 *         description: Vendor not found
 */
router.patch('/:id', authorize(P.VENDORS_UPDATE), validate(updateVendorSchema), vendorController.update);

/**
 * @swagger
 * /vendors/{id}/status:
 *   patch:
 *     summary: Update vendor status
 *     tags: [Vendors]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending_verification, blocked]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authorize(P.VENDORS_MANAGE_STATUS), validate(updateVendorStatusSchema), vendorController.updateStatus);

/**
 * @swagger
 * /vendors/{id}/listings:
 *   get:
 *     summary: Get all vehicle listings for a vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Vendor listings retrieved
 */
router.get('/:id/listings', authorize(P.VENDORS_READ), validate(idParamSchema), vendorController.getVendorListings);

module.exports = router;
