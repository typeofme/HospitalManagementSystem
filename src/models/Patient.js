const db = require('../../database/connection');

class Patient {
  static async findAll(limit = 50, offset = 0) {
    return await db('patients')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');
  }
  
  static async findById(id) {
    return await db('patients').where({ id }).first();
  }
  
  static async findByPatientId(patientId) {
    return await db('patients').where({ patient_id: patientId }).first();
  }
  
  static async create(patientData) {
    const [id] = await db('patients').insert(patientData);
    return await this.findById(id);
  }
  
  static async update(id, patientData) {
    await db('patients').where({ id }).update(patientData);
    return await this.findById(id);
  }
  
  static async delete(id) {
    return await db('patients').where({ id }).del();
  }
  
  static async search(searchTerm) {
    return await db('patients')
      .where('first_name', 'like', `%${searchTerm}%`)
      .orWhere('last_name', 'like', `%${searchTerm}%`)
      .orWhere('patient_id', 'like', `%${searchTerm}%`)
      .orWhere('email', 'like', `%${searchTerm}%`)
      .limit(20);
  }
  
  static async count() {
    const result = await db('patients').count('* as count').first();
    return result.count;
  }
  
  static async getWithAppointments(patientId) {
    return await db('patients')
      .select(
        'patients.*',
        'appointments.id as appointment_id',
        'appointments.appointment_date',
        'appointments.status as appointment_status',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name'
      )
      .leftJoin('appointments', 'patients.id', 'appointments.patient_id')
      .leftJoin('doctors', 'appointments.doctor_id', 'doctors.id')
      .where('patients.id', patientId)
      .orderBy('appointments.appointment_date', 'desc');
  }
}

module.exports = Patient;
