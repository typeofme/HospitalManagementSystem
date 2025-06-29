const express = require('express');
const router = express.Router();
const MedicalRecordController = require('../controllers/MedicalRecordController');

// GET /api/medical-records - Get all medical records with pagination
router.get('/', MedicalRecordController.index);

// GET /api/medical-records/search - Search medical records
router.get('/search', MedicalRecordController.search);

// GET /api/medical-records/patient/:patientId - Get medical records by patient
router.get('/patient/:patientId', MedicalRecordController.getByPatient);

// GET /api/medical-records/doctor/:doctorId - Get medical records by doctor
router.get('/doctor/:doctorId', MedicalRecordController.getByDoctor);

// GET /api/medical-records/:id - Get medical record by ID
router.get('/:id', MedicalRecordController.show);

// POST /api/medical-records - Create new medical record
router.post('/', MedicalRecordController.store);

// PUT /api/medical-records/:id - Update medical record
router.put('/:id', MedicalRecordController.update);

// DELETE /api/medical-records/:id - Delete medical record
router.delete('/:id', MedicalRecordController.destroy);

module.exports = router;

// GET /api/medical-records - Get all medical records
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const records = await db('medical_records')
      .select(
        'medical_records.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'patients.patient_id',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name'
      )
      .leftJoin('patients', 'medical_records.patient_id', 'patients.id')
      .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id')
      .limit(limit)
      .offset(offset)
      .orderBy('medical_records.visit_date', 'desc');
    
    const totalCount = await db('medical_records').count('* as count').first();
    const totalPages = Math.ceil(totalCount.count / limit);
    
    res.json({
      records,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: totalCount.count,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/medical-records/:id - Get medical record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await db('medical_records')
      .select(
        'medical_records.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'patients.patient_id',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name'
      )
      .leftJoin('patients', 'medical_records.patient_id', 'patients.id')
      .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id')
      .where('medical_records.id', req.params.id)
      .first();
      
    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/medical-records - Create new medical record
router.post('/', async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      record_number: `MR${Date.now()}`,
      visit_date: req.body.visit_date || new Date().toISOString().split('T')[0]
    };
    
    const [id] = await db('medical_records').insert(recordData);
    const record = await db('medical_records').where({ id }).first();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/medical-records/:id - Update medical record
router.put('/:id', async (req, res) => {
  try {
    await db('medical_records').where({ id: req.params.id }).update(req.body);
    const record = await db('medical_records').where({ id: req.params.id }).first();
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/medical-records/:id - Delete medical record
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('medical_records').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
