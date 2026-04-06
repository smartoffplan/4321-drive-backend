const { Router } = require("express");
const inquiryController = require("./inquiry.controller");
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const validate = require("../../middleware/validate");
const P = require("../../permissions/permissions");
const {
  logWhatsAppClickSchema,
  submitBookingInquirySchema,
  updateInquirySchema,
  inquiriesQuerySchema,
} = require("./inquiry.validation");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: Booking inquiries and WhatsApp click logging
 */

/**
 * @swagger
 * /inquiries/whatsapp-click:
 *   post:
 *     summary: Log a WhatsApp click inquiry
 *     description: Called by the frontend when a user clicks the WhatsApp button. No authentication required.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [parent_vehicle_id]
 *             properties:
 *               parent_vehicle_id:
 *                 type: string
 *               driver_selected:
 *                 type: boolean
 *                 default: false
 *               page_type:
 *                 type: string
 *               utm_source:
 *                 type: string
 *               utm_medium:
 *                 type: string
 *               utm_campaign:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry logged
 *       404:
 *         description: Parent vehicle not found
 */
router.post(
  "/whatsapp-click",
  validate(logWhatsAppClickSchema),
  inquiryController.logWhatsAppClick,
);

/**
 * @swagger
 * /inquiries/submit:
 *   post:
 *     summary: Submit a booking inquiry from the public booking form
 *     description: No authentication required. Captures full customer and booking details.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [parent_vehicle_id, customer_name, customer_email, customer_phone, drive_mode]
 *             properties:
 *               parent_vehicle_id:
 *                 type: string
 *               customer_name:
 *                 type: string
 *               customer_email:
 *                 type: string
 *               customer_phone:
 *                 type: string
 *               drive_mode:
 *                 type: string
 *                 enum: [self, chauffeur]
 *               chauffeur_type:
 *                 type: string
 *                 enum: [standard, senior, executive]
 *               service_type:
 *                 type: string
 *                 enum: [point-to-point, hourly, full-day]
 *               language_preference:
 *                 type: string
 *               pickup_location:
 *                 type: string
 *               pickup_date:
 *                 type: string
 *               pickup_time:
 *                 type: string
 *               return_date:
 *                 type: string
 *               return_time:
 *                 type: string
 *               special_instructions:
 *                 type: string
 *               base_daily_price:
 *                 type: number
 *               chauffeur_fee:
 *                 type: number
 *               total_daily_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Inquiry submitted
 *       404:
 *         description: Vehicle not found
 */
router.post(
  "/submit",
  validate(submitBookingInquirySchema),
  inquiryController.submitBookingInquiry,
);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: List all inquiries (admin)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: parent_vehicle_id
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [new, contacted, confirmed, completed, cancelled] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inquiries retrieved
 */
router.get(
  "/",
  auth,
  authorize(P.INQUIRIES_READ),
  validate(inquiriesQuerySchema),
  inquiryController.getAll,
);

/**
 * @swagger
 * /inquiries/summary:
 *   get:
 *     summary: Get inquiry analytics summary
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved
 */
router.get(
  "/summary",
  auth,
  authorize(P.INQUIRIES_READ),
  inquiryController.getSummary,
);

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: Get a single inquiry by ID (admin)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inquiry retrieved
 *       404:
 *         description: Inquiry not found
 */
router.get(
  "/:id",
  auth,
  authorize(P.INQUIRIES_READ),
  inquiryController.getById,
);

/**
 * @swagger
 * /inquiries/{id}:
 *   patch:
 *     summary: Update inquiry status and admin notes (admin)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, contacted, confirmed, completed, cancelled]
 *               admin_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inquiry updated
 */
router.patch(
  "/:id",
  auth,
  authorize(P.INQUIRIES_READ),
  validate(updateInquirySchema),
  inquiryController.updateInquiry,
);

module.exports = router;
