const express = require("express");
const router = express.Router();
const {
    getAllUsersController,
    updateUserDataController,
    softDeleteUser
} = require('../controllers/UserController');
const { paginationMiddleware, authenticateUser } = require('../utils/middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the user
 *           example: 64c2f3ae2c9e4a5a3b1d7e88
 *         username:
 *           type: string
 *           description: Username of the user
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           enum: [Admin, User]
 *           description: Role of the user
 *           example: User
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Last login date
 *           example: 2024-08-07T10:15:30Z
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active
 *           example: true
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Deletion timestamp if soft-deleted
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: 2024-01-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: 2024-06-01T15:30:00Z
 *       required:
 *         - _id
 *         - username
 *         - email
 *         - role
 *         - isActive
 *         - createdAt
 *         - updatedAt
 */

/**
 * @swagger
 * /user/fetchallusers:
 *   get:
 *     summary: Retrieve a paginated list of all users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination (starts at 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of users
 *                   example: 150
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: Number of users per page
 *                   example: 10
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/fetchallusers', paginationMiddleware, getAllUsersController);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Partially update user data by user ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Partial user data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               role:
 *                 type: string
 *                 enum: [Admin, User]
 *                 example: User
 *               isActive:
 *                 type: boolean
 *                 example: true
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: User data successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User data successfully updated.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Server error
 */
router.patch('/:id', authenticateUser, updateUserDataController);

/**
 * @swagger
 * /user/{id}/delete:
 *   patch:
 *     summary: Soft delete a user by ID (only owner or admin)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID to soft delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []    # Assumes you use Bearer token auth
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User soft deleted successfully.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: You can only delete your own profile or must be an admin."
 *       404:
 *         description: User not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or already deleted.
 *       500:
 *         description: Server error
 */

router.patch('/:id/delete', authenticateUser, softDeleteUser);

module.exports = router;
