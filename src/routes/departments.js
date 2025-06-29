const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController');
const { requireApiMedicalAccess, requireApiStaffManagement } = require('../middleware/auth');

// GET /api/departments - Get all departments (medical staff can view)
router.get('/', requireApiMedicalAccess, DepartmentController.index);

// GET /api/departments/:id - Get department by ID (medical staff can view)
router.get('/:id', requireApiMedicalAccess, DepartmentController.show);

// POST /api/departments - Create new department (admin/staff only)
router.post('/', requireApiStaffManagement, DepartmentController.store);

// PUT /api/departments/:id - Update department (admin/staff only)
router.put('/:id', requireApiStaffManagement, DepartmentController.update);

// DELETE /api/departments/:id - Delete department (admin/staff only)
router.delete('/:id', requireApiStaffManagement, DepartmentController.destroy);

// GET /api/departments/:id/doctors - Get doctors by department (medical staff can view)
router.get('/:id/doctors', requireApiMedicalAccess, DepartmentController.getDoctors);

// GET /api/departments/stats - Get department statistics (medical staff can view)
router.get('/stats', requireApiMedicalAccess, DepartmentController.stats);

module.exports = router;
