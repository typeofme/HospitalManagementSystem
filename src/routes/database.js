const express = require('express');
const router = express.Router();
const DatabaseController = require('../controllers/DatabaseController');

// Database Functions Routes
router.get('/functions/patients-count', DatabaseController.getCurrentPatientsCount);
router.post('/functions/patient-age', DatabaseController.calculatePatientAge);

// Database Procedures Routes
router.get('/procedures/hospital-stats', DatabaseController.generateHospitalStats);
router.post('/procedures/book-appointment', DatabaseController.bookAppointmentWithValidation);

// Database Views Routes
router.get('/views/patient-summary', DatabaseController.getPatientSummaryView);
router.get('/views/doctor-schedule', DatabaseController.getDoctorScheduleView);
router.get('/views/appointment-details', DatabaseController.getAppointmentDetailsView);
router.get('/views/active-appointments', DatabaseController.getActiveAppointmentsView);
router.get('/views/today-appointments', DatabaseController.getTodayAppointmentsView);

// Audit Log (Triggers Results) Routes
router.get('/audit-log', DatabaseController.getAuditLog);

// Test Routes
router.post('/test/triggers', DatabaseController.testTriggers);

module.exports = router;
