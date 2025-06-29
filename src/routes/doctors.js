const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/DoctorController');
const { requireApiMedicalAccess, requireApiStaffManagement } = require('../middleware/auth');

// GET /api/doctors - Get all doctors (medical staff can view)
router.get('/', requireApiMedicalAccess, DoctorController.getAllDoctors);

// GET /api/doctors/:id - Get doctor by ID (medical staff can view)
router.get('/:id', requireApiMedicalAccess, DoctorController.getDoctorById);

// GET /api/doctors/:id/specializations - Get doctor with specializations (medical staff can view)
router.get('/:id/specializations', requireApiMedicalAccess, DoctorController.getDoctorWithSpecializations);

// GET /api/doctors/department/:departmentId - Get doctors by department (medical staff can view)
router.get('/department/:departmentId', requireApiMedicalAccess, DoctorController.getDoctorsByDepartment);

// POST /api/doctors - Create new doctor (admin/staff only)
router.post('/', requireApiStaffManagement, DoctorController.createDoctor);

// PUT /api/doctors/:id - Update doctor (admin/staff only)
router.put('/:id', requireApiStaffManagement, DoctorController.updateDoctor);

// DELETE /api/doctors/:id - Delete doctor (admin/staff only)
router.delete('/:id', requireApiStaffManagement, DoctorController.deleteDoctor);

module.exports = router;
