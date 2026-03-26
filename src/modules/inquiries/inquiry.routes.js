const { Router } = require('express');
const inquiryController = require('./inquiry.controller');
const auth = require('../../middleware/auth');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const P = require('../../permissions/permissions');
const { logWhatsAppClickSchema, inquiriesQuerySchema } = require('./inquiry.validation');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: WhatsApp inquiry logging and analytics
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
 *                 description: ID of the parent vehicle
 *               driver_selected:
 *                 type: boolean
 *                 default: false
 *               page_type:
 *                 type: string
 *                 example: detail
 *                 description: Where the click happened (listing, detail, featured)
 *               utm_source:
 *                 type: string
 *                 example: google
 *               utm_medium:
 *                 type: string
 *                 example: cpc
 *               utm_campaign:
 *                 type: string
 *                 example: summer_deals
 *     responses:
 *       201:
 *         description: Inquiry logged
 *       404:
 *         description: Parent vehicle not found
 */
router.post('/whatsapp-click', validate(logWhatsAppClickSchema), inquiryController.logWhatsAppClick);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: List all inquiries
 *     tags: [Inquiries]
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
 *     responses:
 *       200:
 *         description: Inquiries retrieved
 */
router.get('/', auth, authorize(P.INQUIRIES_READ), validate(inquiriesQuerySchema), inquiryController.getAll);

/**
 * @swagger
 * /inquiries/summary:
 *   get:
 *     summary: Get inquiry analytics summary
 *     description: Returns total inquiries, last 7 days count, and top 10 vehicles by inquiry count.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved
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
 *                     total:
 *                       type: integer
 *                     last_7_days:
 *                       type: integer
 *                     top_vehicles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           vehicle_name:
 *                             type: string
 *                           brand:
 *                             type: string
 *                           model:
 *                             type: string
 */
router.get('/summary', auth, authorize(P.INQUIRIES_READ), inquiryController.getSummary);

module.exports = router;
