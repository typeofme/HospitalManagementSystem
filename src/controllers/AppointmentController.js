const Appointment = require('../models/Appointment');

class AppointmentController {
  static async getAllAppointments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;
      
      const appointments = await Appointment.findAll(limit, offset);
      const totalCount = await Appointment.count();
      const totalPages = Math.ceil(totalCount / limit);
      
      res.json({
        appointments,
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
  
  static async getAppointmentById(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async createAppointment(req, res) {
    try {
      const appointmentData = {
        ...req.body,
        appointment_number: `APT${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Validate required fields
      if (!appointmentData.patient_id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }
      
      if (!appointmentData.doctor_id) {
        return res.status(400).json({ error: 'Doctor ID is required' });
      }
      
      if (!appointmentData.appointment_date) {
        return res.status(400).json({ error: 'Appointment date is required' });
      }
      
      console.log('Creating appointment with data:', appointmentData); // Debug log
      
      console.log('Creating appointment with data:', appointmentData); // Debug log
      
      const appointment = await Appointment.create(appointmentData);
      console.log('Created appointment:', appointment); // Debug log
      console.log('Created appointment:', appointment); // Debug log
      
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(400).json({ error: error.message });
    }
  }
  
  static async updateAppointment(req, res) {
    try {
      const appointment = await Appointment.update(req.params.id, req.body);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async deleteAppointment(req, res) {
    try {
      const deleted = await Appointment.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getTodaysAppointments(req, res) {
    try {
      const appointments = await Appointment.getTodaysAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getAppointmentsByPatient(req, res) {
    try {
      const appointments = await Appointment.getByPatient(req.params.patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  static async getAppointmentsByDoctor(req, res) {
    try {
      const { date } = req.query;
      const appointments = await Appointment.getByDoctor(req.params.doctorId, date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentController;
