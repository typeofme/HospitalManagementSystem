/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('medical_records').del();
  
  const medicalRecords = [];
  const complaints = [
    'Chest pain and shortness of breath',
    'Severe headache with nausea',
    'Abdominal pain and vomiting',
    'Joint pain and swelling',
    'Skin rash and itching',
    'Fatigue and weakness',
    'Dizziness and confusion'
  ];
  
  const diagnoses = [
    'Hypertension', 'Diabetes mellitus type 2', 'Asthma', 'Pneumonia',
    'Gastroenteritis', 'Arthritis', 'Dermatitis', 'Migraine',
    'Anxiety disorder', 'Upper respiratory infection'
  ];
  
  const medications = [
    'Lisinopril 10mg daily', 'Metformin 500mg twice daily',
    'Albuterol inhaler as needed', 'Amoxicillin 500mg three times daily',
    'Ibuprofen 400mg as needed', 'Omeprazole 20mg daily'
  ];
  
  // Create 3000 medical records
  for (let i = 1; i <= 3000; i++) {
    const visitDate = faker.date.between({ from: '2023-01-01', to: '2024-12-31' });
    const patientId = faker.number.int({ min: 1, max: 5000 });
    const doctorId = faker.number.int({ min: 1, max: 10 });
    const appointmentId = Math.random() > 0.3 ? faker.number.int({ min: 1, max: 8000 }) : null;
    
    medicalRecords.push({
      id: i,
      record_number: `MR${String(i).padStart(6, '0')}`,
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_id: appointmentId,
      visit_date: visitDate.toISOString().split('T')[0],
      chief_complaint: faker.helpers.arrayElement(complaints),
      history_of_present_illness: faker.lorem.paragraph(),
      physical_examination: faker.lorem.sentences(3),
      diagnosis: faker.helpers.arrayElement(diagnoses),
      treatment_plan: faker.lorem.sentences(2),
      medications_prescribed: faker.helpers.arrayElement(medications),
      lab_tests_ordered: Math.random() > 0.6 ? 'Blood work, Urinalysis' : null,
      follow_up_instructions: 'Return in 2 weeks if symptoms persist',
      vital_signs_temperature: faker.number.float({ min: 96.5, max: 102.0, fractionDigits: 1 }),
      vital_signs_blood_pressure_systolic: faker.number.int({ min: 90, max: 180 }),
      vital_signs_blood_pressure_diastolic: faker.number.int({ min: 60, max: 120 }),
      vital_signs_heart_rate: faker.number.int({ min: 60, max: 120 }),
      vital_signs_respiratory_rate: faker.number.int({ min: 12, max: 30 })
    });
  }
  
  // Insert in batches
  const batchSize = 1000;
  for (let i = 0; i < medicalRecords.length; i += batchSize) {
    const batch = medicalRecords.slice(i, i + batchSize);
    await knex('medical_records').insert(batch);
  }
};
