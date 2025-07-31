/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('appointments').del();
  
  const appointments = [];
  const statuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
  const types = ['consultation', 'follow_up', 'emergency', 'surgery', 'diagnostic'];
  const reasons = [
    'Regular checkup', 'Chest pain', 'Headaches', 'Joint pain', 'Skin rash',
    'Follow-up visit', 'Lab results review', 'Medication adjustment',
    'Routine screening', 'Pre-operative consultation'
  ];
  
  // Create 8000 appointments for large dataset testing
  for (let i = 1; i <= 8000; i++) {
    const appointmentDate = faker.date.between({ from: '2025-08-25', to: '2025-12-31' });
    const patientId = faker.number.int({ min: 1, max: 5000 });
    const doctorId = faker.number.int({ min: 1, max: 10 });
    
    appointments.push({
      id: i,
      appointment_number: `APT${String(i).padStart(6, '0')}`,
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentDate.toISOString().slice(0, 19).replace('T', ' '),
      duration_minutes: faker.helpers.arrayElement([15, 30, 45, 60, 90, 120]),
      type: faker.helpers.arrayElement(types),
      status: faker.helpers.arrayElement(statuses),
      reason: faker.helpers.arrayElement(reasons),
      notes: Math.random() > 0.5 ? faker.lorem.sentence() : null,
      fee: faker.number.float({ min: 50, max: 500, fractionDigits: 2 })
    });
  }
  
  // Insert in batches
  const batchSize = 1000;
  for (let i = 0; i < appointments.length; i += batchSize) {
    const batch = appointments.slice(i, i + batchSize);
    await knex('appointments').insert(batch);
  }
};
