const Doctor = require('../models/Doctor');
const logAction = require('../utils/logAction');

class DoctorController {
  static async getAllDoctors(req, res) {
    try {
      const doctors = await Doctor.findAll();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getDoctorById(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async createDoctor(req, res) {
    try {
      const doctorData = {
        ...req.body,
        employee_id: `DOC${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        hire_date: req.body.hire_date || new Date().toISOString().split('T')[0]
      };
      
      const doctor = await Doctor.create(doctorData);
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'CREATE',
        entity: 'Doctor',
        entityId: doctor.id,
        description: `Created doctor ${doctor.first_name} ${doctor.last_name}`
      });
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async updateDoctor(req, res) {
    try {
      const doctor = await Doctor.update(req.params.id, req.body);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'UPDATE',
        entity: 'Doctor',
        entityId: req.params.id,
        description: `Updated doctor ID ${req.params.id}`
      });
      res.json(doctor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async deleteDoctor(req, res) {
    try {
      const deleted = await Doctor.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      // Log action
      await logAction({
        userId: req.session?.user?.id || null,
        action: 'DELETE',
        entity: 'Doctor',
        entityId: req.params.id,
        description: `Deleted doctor ID ${req.params.id}`
      });
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getDoctorWithSpecializations(req, res) {
    try {
      const doctorData = await Doctor.getWithSpecializations(req.params.id);
      if (!doctorData.length) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      // Group specializations under doctor
      const doctor = {
        ...doctorData[0],
        specializations: doctorData
          .filter(row => row.treatment_name)
          .map(row => ({
            treatment: row.treatment_name,
            experience_years: row.experience_years,
            proficiency_level: row.proficiency_level
          }))
      };
      
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getDoctorsByDepartment(req, res) {
    try {
      const doctors = await Doctor.getByDepartment(req.params.departmentId);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DoctorController;
