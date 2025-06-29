const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const db = require('../../database/connection');
const { requireMedicalAccess, requireStaffManagement } = require('../middleware/auth');

// Dashboard home page
router.get('/', async (req, res) => {
  try {
    const stats = {
      totalPatients: await Patient.count(),
      totalDoctors: await Doctor.count(),
      totalAppointments: await Appointment.count(),
      todaysAppointments: (await Appointment.getTodaysAppointments()).length
    };
    
    const recentAppointments = await db('appointments')
      .select(
        'appointments.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'patients.patient_id',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name',
        'doctors.employee_id'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .leftJoin('doctors', 'appointments.doctor_id', 'doctors.id')
      .orderBy('appointments.created_at', 'desc')
      .limit(5);
    
    res.render('dashboard', { 
      title: 'Hospital Management Dashboard',
      stats,
      recentAppointments
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Dashboard Error',
      error: error.message
    });
  }
});

router.get('/dashboard', async (req, res) => {
  res.redirect('/');
});

// Patients management page
router.get('/patients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const patientsResult = await Patient.findAll(20, (page - 1) * 20);
    const patients = patientsResult.patients || patientsResult;
    const totalCount = await Patient.count();
    
    res.render('patients', { 
      title: 'Patients Management',
      patients,
      currentPage: page,
      totalPages: Math.ceil(totalCount / 20),
      totalCount
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Patients Error',
      error: error.message 
    });
  }
});

// Patient details page
router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).render('error', { 
        title: 'Patient Not Found',
        error: 'Patient not found' 
      });
    }
    
    const appointments = await Appointment.getByPatient(req.params.id);
    
    res.render('patient-details', { 
      title: `Patient: ${patient.first_name} ${patient.last_name}`,
      patient,
      appointments
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: error.message 
    });
  }
});

// Doctor details page
router.get('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).render('error', { 
        title: 'Doctor Not Found',
        error: 'Doctor not found' 
      });
    }
    
    const appointments = await Appointment.getByDoctor(req.params.id);
    const specializations = await Doctor.getWithSpecializations(req.params.id);
    
    res.render('doctor-details', { 
      title: `Dr. ${doctor.first_name} ${doctor.last_name}`,
      doctor,
      appointments,
      specializations: specializations.filter(s => s.treatment_name).map(s => ({
        treatment: s.treatment_name,
        experience_years: s.experience_years,
        proficiency_level: s.proficiency_level
      }))
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Doctor Error',
      error: error.message 
    });
  }
});

// Appointment details page
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).render('error', { title: 'Appointment Not Found', error: 'Appointment not found' });
    }
    
    res.render('appointment-details', { 
      title: `Appointment Details`,
      appointment
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Appointment Error',
      error: error.message 
    });
  }
});

// Department details page
router.get('/departments/:id', async (req, res) => {
  try {
    const department = await db('departments').where({ id: req.params.id }).first();
    if (!department) {
      return res.status(404).render('error', { title: 'Department Not Found', error: 'Department not found' });
    }
    
    const doctors = await Doctor.getByDepartment(req.params.id);
    
    res.render('department-details', { 
      title: `Department: ${department.name}`,
      department,
      doctors
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Medical record details page
router.get('/medical-records/:id', async (req, res) => {
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
      return res.status(404).render('error', { title: 'Medical Record Not Found', error: 'Medical record not found' });
    }
    
    res.render('medical-record-details', { 
      title: `Medical Record Details`,
      record
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Treatment details page
router.get('/treatments/:id', async (req, res) => {
  try {
    const treatment = await db('treatments').where({ id: req.params.id }).first();
    if (!treatment) {
      return res.status(404).render('error', { title: 'Treatment Not Found', error: 'Treatment not found' });
    }
    
    const doctors = await db('doctor_specializations')
      .select(
        'doctors.*',
        'departments.name as department_name',
        'doctor_specializations.experience_years',
        'doctor_specializations.proficiency_level'
      )
      .leftJoin('doctors', 'doctor_specializations.doctor_id', 'doctors.id')
      .leftJoin('departments', 'doctors.department_id', 'departments.id')
      .where('doctor_specializations.treatment_id', req.params.id)
      .orderBy('doctor_specializations.proficiency_level', 'desc');
    
    res.render('treatment-details', { 
      title: `Treatment: ${treatment.name}`,
      treatment,
      doctors
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Doctors management page (admin/staff only)
router.get('/doctors', requireStaffManagement, async (req, res) => {
  try {
    const doctorsResult = await Doctor.findAll();
    const doctors = doctorsResult.doctors || doctorsResult;
    const departments = await db('departments').select('*').orderBy('name');
    
    res.render('doctors', { 
      title: 'Doctors Management',
      doctors,
      departments
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Appointments management page
router.get('/appointments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // Get appointments with patient and doctor info, ordered by creation date (newest first)
    const appointments = await db('appointments')
      .select(
        'appointments.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'patients.patient_id',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name',
        'doctors.employee_id'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .leftJoin('doctors', 'appointments.doctor_id', 'doctors.id')
      .orderBy('appointments.created_at', 'desc')
      .limit(limit)
      .offset(offset);
      
    const totalCount = await Appointment.count();
    
    res.render('appointments', { 
      title: 'Appointments Management',
      appointments,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    });
  } catch (error) {
    console.error('Error loading appointments page:', error);
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Departments management page (admin/staff only)
router.get('/departments', requireStaffManagement, async (req, res) => {
  try {
    const departments = await db('departments').select('*').orderBy('name');
    
    res.render('departments', { 
      title: 'Departments Management',
      departments
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Medical Records management page
router.get('/medical-records', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
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
      .limit(20)
      .offset((page - 1) * 20)
      .orderBy('medical_records.visit_date', 'desc');
    
    const totalCount = await db('medical_records').count('* as count').first();
    
    res.render('medical-records', { 
      title: 'Medical Records Management',
      records,
      currentPage: page,
      totalPages: Math.ceil(totalCount.count / 20),
      totalCount: totalCount.count
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Treatments management page
router.get('/treatments', async (req, res) => {
  try {
    const treatments = await db('treatments').select('*').orderBy('name');
    
    res.render('treatments', { 
      title: 'Treatments Management',
      treatments
    });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: error.message });
  }
});

// Database features demo page
router.get('/database-features', (req, res) => {
  res.render('database-features', {
    title: 'Database Features Demo',
    user: req.session.user
  });
});

module.exports = router;
