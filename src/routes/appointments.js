const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

// GET /api/appointments - Get all appointments
router.get('/', AppointmentController.getAllAppointments);

// GET /api/appointments/today - Get today's appointments
router.get('/today', AppointmentController.getTodaysAppointments);

// GET /api/appointments/patient/:patientId - Get appointments by patient
router.get('/patient/:patientId', AppointmentController.getAppointmentsByPatient);

// GET /api/appointments/doctor/:doctorId - Get appointments by doctor
router.get('/doctor/:doctorId', AppointmentController.getAppointmentsByDoctor);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', AppointmentController.getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', AppointmentController.createAppointment);

// PUT /api/appointments/:id - Update appointment
router.put('/:id', AppointmentController.updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', AppointmentController.deleteAppointment);

module.exports = router;
