const db = require('../../database/connection');

class Treatment {
  static async findAll() {
    return await db('treatments')
      .select('*')
      .where('is_active', true)
      .orderBy('name');
  }
  
  static async findById(id) {
    return await db('treatments').where({ id }).first();
  }
  
  static async create(treatmentData) {
    const [id] = await db('treatments').insert(treatmentData);
    return await this.findById(id);
  }
  
  static async update(id, treatmentData) {
    await db('treatments').where({ id }).update(treatmentData);
    return await this.findById(id);
  }
  
  static async delete(id) {
    return await db('treatments').where({ id }).del();
  }
  
  static async getByCategory(category) {
    return await db('treatments')
      .select('*')
      .where({ category, is_active: true })
      .orderBy('name');
  }
  
  static async getTreatmentsByDoctor(doctorId) {
    return await db('treatments')
      .select(
        'treatments.*',
        'doctor_specializations.experience_years',
        'doctor_specializations.proficiency_level'
      )
      .innerJoin('doctor_specializations', 'treatments.id', 'doctor_specializations.treatment_id')
      .where('doctor_specializations.doctor_id', doctorId)
      .orderBy('treatments.name');
  }
  
  static async getDoctorsByTreatment(treatmentId) {
    return await db('doctors')
      .select(
        'doctors.*',
        'doctor_specializations.experience_years',
        'doctor_specializations.proficiency_level'
      )
      .innerJoin('doctor_specializations', 'doctors.id', 'doctor_specializations.doctor_id')
      .where('doctor_specializations.treatment_id', treatmentId)
      .where('doctors.status', 'active')
      .orderBy('doctors.last_name');
  }
}

module.exports = Treatment;
