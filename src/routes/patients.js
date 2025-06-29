const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/PatientController');

// GET /api/patients - Get all patients with pagination
router.get('/', PatientController.getAllPatients);

// GET /api/patients/search - Search patients
router.get('/search', PatientController.searchPatients);

// GET /api/patients/:id - Get patient by ID
router.get('/:id', PatientController.getPatientById);

// GET /api/patients/:id/appointments - Get patient with appointments
router.get('/:id/appointments', PatientController.getPatientWithAppointments);

// POST /api/patients - Create new patient
router.post('/', PatientController.createPatient);

// PUT /api/patients/:id - Update patient
router.put('/:id', PatientController.updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', PatientController.deletePatient);

module.exports = router;
