const { Router } = require("express");
const userController = require("./user.controller");
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const validate = require("../../middleware/validate");
const P = require("../../permissions/permissions");
const {
  createAdminSchema,
  updateAdminSchema,
  getUsersQuerySchema,
  idParamSchema,
} = require("./user.validation");

const router = Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin user management
 */

/**
 * @swagger
 * /users/admins:
 *   post:
 *     summary: Create a new admin user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password]
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: New Admin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newadmin@4321drive.com
 *               password:
 *                 type: string
 *                 example: securepass123
 *               phone:
 *                 type: string
 *                 example: "+971543218884"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 default: active
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       409:
 *         description: Email already exists
 */
router.post(
  "/admins",
  authorize(P.USERS_CREATE_ADMIN),
  validate(createAdminSchema),
  userController.createAdmin,
);

/**
 * @swagger
 * /users/admins:
 *   get:
 *     summary: List all admin users
 *     tags: [Users]
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
 *           enum: [active, inactive, suspended]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 */
router.get(
  "/admins",
  authorize(P.USERS_READ),
  validate(getUsersQuerySchema),
  userController.getAdmins,
);

/**
 * @swagger
 * /users/admins/{id}:
 *   get:
 *     summary: Get admin user by ID
 *     tags: [Users]
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
 *         description: Admin retrieved
 *       404:
 *         description: Admin not found
 */
router.get(
  "/admins/:id",
  authorize(P.USERS_READ),
  validate(idParamSchema),
  userController.getAdminById,
);

/**
 * @swagger
 * /users/admins/{id}:
 *   patch:
 *     summary: Update admin user
 *     tags: [Users]
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
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Admin updated
 *       404:
 *         description: Admin not found
 */
router.patch(
  "/admins/:id",
  authorize(P.USERS_UPDATE_ADMIN),
  validate(updateAdminSchema),
  userController.updateAdmin,
);

/**
 * @swagger
 * /users/admins/{id}:
 *   delete:
 *     summary: Delete admin user (soft delete)
 *     tags: [Users]
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
 *         description: Admin deactivated
 *       404:
 *         description: Admin not found
 */
router.delete(
  "/admins/:id",
  authorize(P.USERS_DELETE_ADMIN),
  validate(idParamSchema),
  userController.deleteAdmin,
);

module.exports = router;
