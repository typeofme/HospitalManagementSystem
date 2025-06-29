const db = require('../../database/connection');

class Doctor {
  static async findAll() {
    return await db('doctors')
      .select(
        'doctors.*',
        'departments.name as department_name'
      )
      .leftJoin('departments', 'doctors.department_id', 'departments.id')
      .orderBy('doctors.last_name');
  }
  
  static async findById(id) {
    return await db('doctors')
      .select(
        'doctors.*',
        'departments.name as department_name'
      )
      .leftJoin('departments', 'doctors.department_id', 'departments.id')
      .where('doctors.id', id)
      .first();
  }
  
  static async findByEmployeeId(employeeId) {
    return await db('doctors').where({ employee_id: employeeId }).first();
  }
  
  static async create(doctorData) {
    const [id] = await db('doctors').insert(doctorData);
    return await this.findById(id);
  }
  
  static async update(id, doctorData) {
    await db('doctors').where({ id }).update(doctorData);
    return await this.findById(id);
  }
  
  static async delete(id) {
    return await db('doctors').where({ id }).del();
  }
  
  static async getWithSpecializations(doctorId) {
    return await db('doctors')
      .select(
        'doctors.*',
        'departments.name as department_name',
        'treatments.name as treatment_name',
        'doctor_specializations.experience_years',
        'doctor_specializations.proficiency_level'
      )
      .leftJoin('departments', 'doctors.department_id', 'departments.id')
      .leftJoin('doctor_specializations', 'doctors.id', 'doctor_specializations.doctor_id')
      .leftJoin('treatments', 'doctor_specializations.treatment_id', 'treatments.id')
      .where('doctors.id', doctorId);
  }
  
  static async getByDepartment(departmentId) {
    return await db('doctors')
      .select('*')
      .where({ department_id: departmentId, status: 'active' })
      .orderBy('last_name');
  }
  
  static async count() {
    const result = await db('doctors').count('* as count').first();
    return result.count;
  }
}

module.exports = Doctor;
