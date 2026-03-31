const { Router } = require("express");
const uploadController = require("./upload.controller");
const upload = require("../../middleware/upload");
const auth = require("../../middleware/auth");
const authorize = require("../../middleware/authorize");
const P = require("../../permissions/permissions");

const router = Router();

// Require authentication for uploads
router.use(auth);

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image to S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post("/image", upload.single("image"), uploadController.uploadImage);

module.exports = router;
