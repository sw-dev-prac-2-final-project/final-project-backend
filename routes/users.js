const express = require("express");
const { getUsers } = require("../controllers/users");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Administrative endpoints for managing the user directory and stock activity visibility
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDirectoryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         tel:
 *           type: string
 *           description: Contact phone number
 *         role:
 *           type: string
 *           enum: [admin, staff]
 *           description: Role assigned to the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time the user account was created
 *         requestSummary:
 *           type: object
 *           description: Aggregated request activity tied to stock movements
 *           properties:
 *             totalRequests:
 *               type: integer
 *               description: Total number of stock requests created by the user
 *             stockIn:
 *               type: integer
 *               description: Number of stock-in requests
 *             stockOut:
 *               type: integer
 *               description: Number of stock-out requests
 *     UserDirectoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         count:
 *           type: integer
 *           description: Number of users returned by the query
 *         roleFilter:
 *           type: string
 *           description: Role filter applied to the query
 *           example: all
 *         roleSummary:
 *           type: object
 *           description: Count of users per role and in total
 *           additionalProperties:
 *             type: integer
 *           example:
 *             admin: 2
 *             staff: 5
 *             total: 7
 *         requestSummary:
 *           type: object
 *           description: Aggregated request activity for all returned users
 *           properties:
 *             totalRequests:
 *               type: integer
 *             stockIn:
 *               type: integer
 *             stockOut:
 *               type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserDirectoryEntry'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve every user along with their stock request activity
 *     description: |
 *       Returns a directory of all users (staff and admin) together with aggregate stock-in and stock-out request counts.
 *       Only administrators can access this endpoint.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, staff]
 *         description: Filter directory results by role.
 *       - in: query
 *         name: includeRequests
 *         schema:
 *           type: boolean
 *           description: Include per-user and aggregate request statistics. Defaults to true.
 *         example: false
 *     responses:
 *       200:
 *         description: User directory with stock activity summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDirectoryResponse'
 *       400:
 *         description: Invalid role filter supplied
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden for non-admin users
 */
router.get("/", protect, authorize("admin"), getUsers);

module.exports = router;
