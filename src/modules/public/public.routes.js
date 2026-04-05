const { Router } = require("express");
const Joi = require("joi");
const publicController = require("./public.controller");
const validate = require("../../middleware/validate");

const router = Router();

const publicVehiclesQuery = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    brand: Joi.string().trim(),
    category: Joi.string().trim(),
    search: Joi.string().trim(),
    location: Joi.string().trim(),
    make: Joi.string().trim(),
    is_featured: Joi.boolean(),
    sort_by: Joi.string()
      .valid("sort_priority", "price", "created_at")
      .default("sort_priority"),
    sort_order: Joi.string().valid("asc", "desc").default("desc"),
  }),
};

const slugParam = {
  params: Joi.object({ slug: Joi.string().required() }),
};

const idParam = {
  params: Joi.object({ id: Joi.string().required() }),
};

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Public frontend endpoints — no authentication required. Only returns public-safe vehicle data (no vendor info, no internal pricing).
 */

/**
 * @swagger
 * /public/vehicles:
 *   get:
 *     summary: List public vehicles for frontend
 *     description: Returns only active vehicles with show_on_frontend enabled. No vendor data or internal pricing exposed.
 *     tags: [Public]
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
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, brand, model, or tags
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filter by make/model
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *         description: Filter for featured vehicles
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [sort_priority, price, created_at]
 *           default: sort_priority
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
router.get(
  "/vehicles",
  validate(publicVehiclesQuery),
  publicController.getVehicles,
);

/**
 * @swagger
 * /public/vehicles/id/{id}:
 *   get:
 *     summary: Get public vehicle by ID
 *     description: Returns a single active vehicle with public-safe fields only.
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Vehicle retrieved
 *       404:
 *         description: Vehicle not found
 */
router.get(
  "/vehicles/id/:id",
  validate(idParam),
  publicController.getVehicleById,
);

/**
 * @swagger
 * /public/vehicles/{slug}:
 *   get:
 *     summary: Get public vehicle by slug
 *     description: Returns a single active vehicle with public-safe fields only. Used for vehicle detail page.
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: audi-a8
 *     responses:
 *       200:
 *         description: Vehicle retrieved
 *       404:
 *         description: Vehicle not found
 */
router.get(
  "/vehicles/:slug",
  validate(slugParam),
  publicController.getVehicleBySlug,
);

module.exports = router;
