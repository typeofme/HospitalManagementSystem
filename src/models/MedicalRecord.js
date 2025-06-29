const db = require('../../database/connection');

class MedicalRecord {
  static async findAll(options = {}) {
    const { limit = 50, offset = 0, patient_id, doctor_id } = options;
    
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
      .leftJoin('doctors', 'medical_records.doctor_id', 'doctors.id')
      .orderBy('medical_records.visit_date', 'desc');
    
    if (patient_id) {
      query = query.where('medical_records.patient_id', patient_id);
    }
    
    if (doctor_id) {
      query = query.where('medical_records.doctor_id', doctor_id);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    if (offset) {
      query = query.offset(offset);
    }
    
    return await query;
  }

  static async findById(id) {
    return await db('medical_records')
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
      .where('medical_records.id', id)
      .first();
  }

  static async create(data) {
    // Generate a unique record number
    const recordNumber = `MR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const recordData = {
      record_number: recordNumber,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      appointment_id: data.appointment_id || null,
      visit_date: data.visit_date,
      chief_complaint: data.chief_complaint || '',
      history_of_present_illness: data.history_of_present_illness || '',
      physical_examination: data.physical_examination || '',
      diagnosis: data.diagnosis || '',
      treatment_plan: data.treatment_plan || data.treatment || '',
      medications_prescribed: data.medications_prescribed || '',
      lab_tests_ordered: data.lab_tests_ordered || '',
      follow_up_instructions: data.follow_up_instructions || '',
      vital_signs_temperature: data.vital_signs_temperature || null,
      vital_signs_blood_pressure_systolic: data.vital_signs_blood_pressure_systolic || null,
      vital_signs_blood_pressure_diastolic: data.vital_signs_blood_pressure_diastolic || null,
      vital_signs_heart_rate: data.vital_signs_heart_rate || null,
      vital_signs_respiratory_rate: data.vital_signs_respiratory_rate || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const [id] = await db('medical_records').insert(recordData);
    return await this.findById(id);
  }

  static async update(id, data) {
    const updateData = {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      appointment_id: data.appointment_id || null,
      visit_date: data.visit_date,
      chief_complaint: data.chief_complaint || '',
      history_of_present_illness: data.history_of_present_illness || '',
      physical_examination: data.physical_examination || '',
      diagnosis: data.diagnosis || '',
      treatment_plan: data.treatment_plan || data.treatment || '',
      medications_prescribed: data.medications_prescribed || '',
      lab_tests_ordered: data.lab_tests_ordered || '',
      follow_up_instructions: data.follow_up_instructions || '',
      vital_signs_temperature: data.vital_signs_temperature || null,
      vital_signs_blood_pressure_systolic: data.vital_signs_blood_pressure_systolic || null,
      vital_signs_blood_pressure_diastolic: data.vital_signs_blood_pressure_diastolic || null,
      vital_signs_heart_rate: data.vital_signs_heart_rate || null,
      vital_signs_respiratory_rate: data.vital_signs_respiratory_rate || null,
      updated_at: new Date()
    };
    
    await db('medical_records').where('id', id).update(updateData);
    return await this.findById(id);
  }

  static async delete(id) {
    return await db('medical_records').where('id', id).del();
  }

  static async count(options = {}) {
    const { patient_id, doctor_id } = options;
    
    let query = db('medical_records');
    
    if (patient_id) {
      query = query.where('patient_id', patient_id);
    }
    
    if (doctor_id) {
      query = query.where('doctor_id', doctor_id);
    }
    
    const result = await query.count('* as count').first();
    return result.count;
  }
}

module.exports = MedicalRecord;
