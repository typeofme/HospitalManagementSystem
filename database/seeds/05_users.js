const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash the default admin password
  const saltRounds = 12;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  
  // Insert seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      email: 'admin@hospital.com',
      password_hash: adminPassword,
      first_name: 'System',
      last_name: 'Administrator',
      role: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      username: 'doctor1',
      email: 'doctor1@hospital.com',
      password_hash: await bcrypt.hash('doctor123', saltRounds),
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      role: 'doctor',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      username: 'nurse1',
      email: 'nurse1@hospital.com',
      password_hash: await bcrypt.hash('nurse123', saltRounds),
      first_name: 'Mary',
      last_name: 'Williams',
      role: 'nurse',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      username: 'staff1',
      email: 'staff1@hospital.com',
      password_hash: await bcrypt.hash('staff123', saltRounds),
      first_name: 'John',
      last_name: 'Smith',
      role: 'staff',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
