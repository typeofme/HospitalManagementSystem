/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('patients').del();
  
  const patients = [];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const statuses = ['active', 'inactive'];
  
  // Create 5000 patients for indexing performance testing
  for (let i = 1; i <= 5000; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthDate = faker.date.birthdate({ min: 1, max: 95, mode: 'age' });
    const registrationDate = faker.date.between({ from: '2020-01-01', to: '2024-12-31' });
    
    patients.push({
      id: i,
      patient_id: `PAT${String(i).padStart(6, '0')}`,
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase() + `.${i}`,
      phone: faker.phone.number('+1-###-###-####'),
      date_of_birth: birthDate.toISOString().split('T')[0],
      gender: faker.helpers.arrayElement(['male', 'female', 'other']),
      address: faker.location.streetAddress({ useFullAddress: true }),
      emergency_contact_name: faker.person.fullName(),
      emergency_contact_phone: faker.phone.number('+1-###-###-####'),
      insurance_number: faker.finance.accountNumber(10),
      blood_type: faker.helpers.arrayElement(bloodTypes),
      allergies: Math.random() > 0.7 ? faker.helpers.arrayElement([
        'Penicillin', 'Latex', 'Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat'
      ]) : null,
      medical_history: Math.random() > 0.6 ? faker.helpers.arrayElement([
        'Hypertension', 'Diabetes Type 2', 'Asthma', 'Heart Disease', 'Cancer History', 'Mental Health'
      ]) : null,
      registration_date: registrationDate.toISOString().split('T')[0],
      status: faker.helpers.arrayElement(statuses)
    });
  }
  
  // Insert in batches to avoid memory issues
  const batchSize = 1000;
  for (let i = 0; i < patients.length; i += batchSize) {
    const batch = patients.slice(i, i + batchSize);
    await knex('patients').insert(batch);
  }
};
