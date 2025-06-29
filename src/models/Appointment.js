const db = require('../../database/connection');

class Appointment {
  static async findAll(limit = 50, offset = 0) {
    return await db('appointments')
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
      .limit(limit)
      .offset(offset)
      .orderBy('appointments.created_at', 'desc');
  }
  
  static async findById(id) {
    return await db('appointments')
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
      .where('appointments.id', id)
      .first();
  }
  
  static async create(appointmentData) {
    const [id] = await db('appointments').insert(appointmentData);
    return await this.findById(id);
  }
  
  static async update(id, appointmentData) {
    await db('appointments').where({ id }).update(appointmentData);
    return await this.findById(id);
  }
  
  static async delete(id) {
    return await db('appointments').where({ id }).del();
  }
  
  static async getByPatient(patientId) {
    return await db('appointments')
      .select(
        'appointments.*',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name'
      )
      .leftJoin('doctors', 'appointments.doctor_id', 'doctors.id')
      .where('appointments.patient_id', patientId)
      .orderBy('appointments.appointment_date', 'desc');
  }
  
  static async getByDoctor(doctorId, date = null) {
    let query = db('appointments')
      .select(
        'appointments.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'patients.patient_id'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .where('appointments.doctor_id', doctorId);
    
    if (date) {
      query = query.whereRaw('DATE(appointment_date) = ?', [date]);
    }
    
    return await query.orderBy('appointments.appointment_date');
  }
  
  static async getTodaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return await db('appointments')
      .select(
        'appointments.*',
        'patients.first_name as patient_first_name',
        'patients.last_name as patient_last_name',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name'
      )
      .leftJoin('patients', 'appointments.patient_id', 'patients.id')
      .leftJoin('doctors', 'appointments.doctor_id', 'doctors.id')
      .whereRaw('DATE(appointment_date) = ?', [today])
      .orderBy('appointments.appointment_date');
  }
  
  static async count() {
    const result = await db('appointments').count('* as count').first();
    return result.count;
  }
}

module.exports = Appointment;
