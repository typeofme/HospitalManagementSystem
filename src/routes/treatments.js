const express = require('express');
const router = express.Router();
const TreatmentController = require('../controllers/TreatmentController');

// GET /api/treatments - Get all treatments
router.get('/', TreatmentController.index);

// GET /api/treatments/search - Search treatments
router.get('/search', TreatmentController.search);

// GET /api/treatments/stats - Get treatment statistics
router.get('/stats', TreatmentController.stats);

// GET /api/treatments/category/:category - Get treatments by category
router.get('/category/:category', TreatmentController.getByCategory);

// GET /api/treatments/:id - Get treatment by ID
router.get('/:id', TreatmentController.show);

// GET /api/treatments/:id/doctors - Get doctors for treatment
router.get('/:id/doctors', TreatmentController.getDoctors);

// POST /api/treatments - Create new treatment
router.post('/', TreatmentController.store);

// PUT /api/treatments/:id - Update treatment
router.put('/:id', TreatmentController.update);

// DELETE /api/treatments/:id - Delete treatment
router.delete('/:id', TreatmentController.destroy);

module.exports = router;
