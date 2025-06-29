const db = require('../../database/connection');

class Department {
  static async findAll() {
    return await db('departments')
      .select('*')
      .orderBy('name');
  }
  
  static async findById(id) {
    return await db('departments').where({ id }).first();
  }
  
  static async create(departmentData) {
    const [id] = await db('departments').insert(departmentData);
    return await this.findById(id);
  }
  
  static async update(id, departmentData) {
    await db('departments').where({ id }).update(departmentData);
    return await this.findById(id);
  }
  
  static async delete(id) {
    return await db('departments').where({ id }).del();
  }
  
  static async getWithDoctors(departmentId) {
    return await db('departments')
      .select(
        'departments.*',
        'doctors.id as doctor_id',
        'doctors.first_name as doctor_first_name',
        'doctors.last_name as doctor_last_name',
        'doctors.specialization'
      )
      .leftJoin('doctors', 'departments.id', 'doctors.department_id')
      .where('departments.id', departmentId);
  }
  
  static async getDepartmentStats() {
    return await db('departments')
      .select(
        'departments.id',
        'departments.name',
        'departments.capacity',
        db.raw('COUNT(doctors.id) as doctor_count'),
        db.raw('COUNT(CASE WHEN doctors.status = "active" THEN 1 END) as active_doctors')
      )
      .leftJoin('doctors', 'departments.id', 'doctors.department_id')
      .groupBy('departments.id', 'departments.name', 'departments.capacity')
      .orderBy('departments.name');
  }
}

module.exports = Department;
