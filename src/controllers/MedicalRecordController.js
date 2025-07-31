const db = require('../../database/connection');
const MedicalRecord = require('../models/MedicalRecord');

class MedicalRecordController {
  // Get all medical records with pagination
  static async index(req, res) {
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
  }

  // Get medical record by ID
  static async show(req, res) {
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
  }

  // Create new medical record
  static async store(req, res) {
    try {
      console.log('Creating medical record with data:', req.body); // Debug log
      
      const record = await MedicalRecord.create(req.body);
      console.log('Successfully created medical record:', record); // Debug log
      
      res.status(201).json(record);
    } catch (error) {
      console.error('Error creating medical record:', error.message); // Debug log
      res.status(400).json({ error: error.message });
    }
  }

  // Update medical record
  static async update(req, res) {
    try {
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };
      
      const updated = await db('medical_records')
        .where({ id: req.params.id })
        .update(updateData);
      
      if (!updated) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      
      const record = await db('medical_records')
        .select(
          'medical_records.*',
          'patients.first_name as patient_first_name',
          'patients.last_name as patient_last_name',
          'doctors.first_name as doctor_first_name',
          'doctors.last_name as doctor_last_name'
        )
        .leftJoin('patients', 'medical_records.patient_id', 'patients.id')
        .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id')
        .where('medical_records.id', req.params.id)
        .first();
      
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete medical record
  static async destroy(req, res) {
    try {
      const deleted = await db('medical_records').where({ id: req.params.id }).del();
      
      if (!deleted) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      
      res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get medical records by patient
  static async getByPatient(req, res) {
    try {
      const records = await db('medical_records')
        .select(
          'medical_records.*',
          'doctors.first_name as doctor_first_name',
          'doctors.last_name as doctor_last_name'
        )
        .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id')
        .where('medical_records.patient_id', req.params.patientId)
        .orderBy('medical_records.visit_date', 'desc');
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get medical records by doctor
  static async getByDoctor(req, res) {
    try {
      const records = await db('medical_records')
        .select(
          'medical_records.*',
          'patients.first_name as patient_first_name',
          'patients.last_name as patient_last_name',
          'patients.patient_id'
        )
        .leftJoin('patients', 'medical_records.patient_id', 'patients.id')
        .where('medical_records.doctor_id', req.params.doctorId)
        .orderBy('medical_records.visit_date', 'desc');
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Search medical records
  static async search(req, res) {
    try {
      const { q: searchTerm, patient_id, doctor_id, diagnosis } = req.query;
      
      let query = db('medical_records')
        .select(
          'medical_records.*',
          'patients.first_name as patient_first_name',
          'patients.last_name as patient_last_name',
          'patients.patient_id',
          'doctors.first_name as doctor_first_name',
          'doctors.last_name as doctor_last_name'
        )
        .leftJoin('patients', 'medical_records.patient_id', 'patients.id')
        .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id');
      
      if (searchTerm) {
        query = query.where(function() {
          this.where('medical_records.diagnosis', 'like', `%${searchTerm}%`)
              .orWhere('medical_records.treatment_plan', 'like', `%${searchTerm}%`)
              .orWhere('medical_records.notes', 'like', `%${searchTerm}%`);
        });
      }
      
      if (patient_id) {
        query = query.where('medical_records.patient_id', patient_id);
      }
      
      if (doctor_id) {
        query = query.where('medical_records.doctor_id', doctor_id);
      }
      
      if (diagnosis) {
        query = query.where('medical_records.diagnosis', 'like', `%${diagnosis}%`);
      }
      
      const records = await query
        .orderBy('medical_records.visit_date', 'desc')
        .limit(50);
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MedicalRecordController;
