/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('doctor_specializations').del();
  
  const specializations = [];
  const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  // Create many-to-many relationships between doctors and treatments
  let id = 1;
  
  // Each doctor should have multiple specializations
  for (let doctorId = 1; doctorId <= 10; doctorId++) {
    // Each doctor gets 3-6 random treatment specializations
    const numberOfSpecializations = faker.number.int({ min: 3, max: 6 });
    const treatmentIds = [];
    
    // Generate unique treatment IDs for this doctor
    while (treatmentIds.length < numberOfSpecializations) {
      const treatmentId = faker.number.int({ min: 1, max: 10 });
      if (!treatmentIds.includes(treatmentId)) {
        treatmentIds.push(treatmentId);
      }
    }
    
    treatmentIds.forEach(treatmentId => {
      specializations.push({
        id: id++,
        doctor_id: doctorId,
        treatment_id: treatmentId,
        experience_years: faker.number.int({ min: 1, max: 15 }),
        proficiency_level: faker.helpers.arrayElement(proficiencyLevels),
        certification_date: faker.date.between({ from: '2010-01-01', to: '2023-12-31' }).toISOString().split('T')[0]
      });
    });
  }
  
  await knex('doctor_specializations').insert(specializations);
};
