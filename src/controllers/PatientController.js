const Patient = require('../models/Patient');
const logAction = require('../utils/logAction');

class PatientController {
  static async getAllPatients(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      
      const patients = await Patient.findAll(limit, offset);
      const totalCount = await Patient.count();
      const totalPages = Math.ceil(totalCount / limit);
      
      res.json({
        patients,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getPatientById(req, res) {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async createPatient(req, res) {
    try {
      const patientData = {
        ...req.body,
        patient_id: `PAT${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        registration_date: new Date().toISOString().split('T')[0]
      };
      
      const patient = await Patient.create(patientData);
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'CREATE',
        entity: 'Patient',
        entityId: patient.id,
        description: `Created patient ${patient.first_name} ${patient.last_name}`
      });
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async updatePatient(req, res) {
    try {
      const patient = await Patient.update(req.params.id, req.body);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'UPDATE',
        entity: 'Patient',
        entityId: req.params.id,
        description: `Updated patient ID ${req.params.id}`
      });
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async deletePatient(req, res) {
    try {
      const deleted = await Patient.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'DELETE',
        entity: 'Patient',
        entityId: req.params.id,
        description: `Deleted patient ID ${req.params.id}`
      });
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async searchPatients(req, res) {
    try {
      const { q: searchTerm } = req.query;
      if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
      }
      
      const patients = await Patient.search(searchTerm);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getPatientWithAppointments(req, res) {
    try {
      const patientData = await Patient.getWithAppointments(req.params.id);
      if (!patientData.length) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // Group appointments under patient
      const patient = {
        ...patientData[0],
        appointments: patientData
          .filter(row => row.appointment_id)
          .map(row => ({
            id: row.appointment_id,
            appointment_date: row.appointment_date,
            status: row.appointment_status,
            doctor: `${row.doctor_first_name} ${row.doctor_last_name}`
          }))
      };
      
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PatientController;
