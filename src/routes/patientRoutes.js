const express = require('express');
const router = express.Router();
const { getAllPatientsController, getPatientController, updatePatientController, uploadPatientImageController } = require('../controllers/PatientController');
const { getPatientShiftsController } = require('../controllers/ShiftController');
const { getHandoverNotesController } = require('../controllers/HandoverController');
const { createMedicationAdministrationController, getMedicationAdministrationsController } = require('../controllers/MedicationController');
const { uploadProfileImage } = require('../utils/upload');
const { authenticateUser } = require('../utils/middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     EmergencyContact:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Thompson
 *         relationship:
 *           type: string
 *           example: Daughter
 *         phoneNumber:
 *           type: string
 *           example: "+441234567890"
 *         email:
 *           type: string
 *           format: email
 *           example: jane.thompson@example.com
 *         isPrimary:
 *           type: boolean
 *           example: true
 *     Patient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64c2f3ae2c9e4a5a3b1d7e88
 *         firstName:
 *           type: string
 *           example: Harold
 *         lastName:
 *           type: string
 *           example: Thompson
 *         profileImg:
 *           type: string
 *           nullable: true
 *           example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           example: 1945-03-15T00:00:00.000Z
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           example: [Penicillin, Shellfish]
 *         alerts:
 *           type: array
 *           items:
 *             type: string
 *           example: [Fall risk, Diabetes]
 *         emergencyContacts:
 *           type: array
 *           maxItems: 2
 *           items:
 *             $ref: '#/components/schemas/EmergencyContact'
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-06-01T15:30:00Z
 *       required:
 *         - _id
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - isActive
 *         - createdAt
 *         - updatedAt
 */

/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Retrieve all active patient records
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server error
 */
router.get('/', authenticateUser, getAllPatientsController);

/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Retrieve a patient record by ID
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The patient ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Unauthorised
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateUser, getPatientController);

/**
 * @swagger
 * /patient/{id}:
 *   patch:
 *     summary: Partially update a patient record by ID
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The patient ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Partial patient data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Harold
 *               lastName:
 *                 type: string
 *                 example: Thompson
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1945-03-15"
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Penicillin, Shellfish]
 *               alerts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Fall risk]
 *               emergencyContacts:
 *                 type: array
 *                 maxItems: 2
 *                 items:
 *                   $ref: '#/components/schemas/EmergencyContact'
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Patient record updated successfully
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
 *                   example: Patient updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Unauthorised
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', authenticateUser, updatePatientController);

/**
 * @swagger
 * /patient/{id}/profile-image:
 *   patch:
 *     summary: Upload or replace a patient's profile image
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The patient ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImg
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPG, PNG or WebP, max 5 MB)
 *     responses:
 *       200:
 *         description: Profile image updated successfully
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
 *                   example: Profile image updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Patient'
 *       400:
 *         description: No image file provided
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
 *                   example: No image file provided
 *       401:
 *         description: Unauthorised
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/profile-image', authenticateUser, uploadProfileImage, uploadPatientImageController);

/**
 * @swagger
 * /patient/{id}/shifts:
 *   get:
 *     summary: Retrieve shifts for a patient grouped by date
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The patient ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: false
 *         description: Month to fetch shifts for, in YYYY-MM format (defaults to current month)
 *         schema:
 *           type: string
 *           example: "2026-04"
 *     responses:
 *       200:
 *         description: Shifts grouped by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         caregiver:
 *                           type: string
 *                           example: sarah_j
 *                         time:
 *                           type: string
 *                           example: "8:00 AM – 4:00 PM"
 *                         type:
 *                           type: string
 *                           example: Morning Care
 *                         status:
 *                           type: string
 *                           example: scheduled
 *       401:
 *         description: Unauthorised
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.get('/:id/shifts', authenticateUser, getPatientShiftsController);

router.get('/:id/handover-notes', authenticateUser, getHandoverNotesController);

router.get('/:id/medication-administrations', authenticateUser, getMedicationAdministrationsController);
router.post('/:id/medication-administrations', authenticateUser, createMedicationAdministrationController);

module.exports = router;
