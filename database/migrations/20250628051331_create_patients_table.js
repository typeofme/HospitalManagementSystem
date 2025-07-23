/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patients', (table) => {
    table.increments('id').primary();
    table.string('patient_id', 20).unique().notNullable();
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.string('email', 100).unique();
    table.string('phone', 50);
    table.date('date_of_birth').notNullable();
    table.enum('gender', ['male', 'female', 'other']);
    table.text('address');
    table.string('emergency_contact_name', 100);
    table.string('emergency_contact_phone', 50);
    table.string('insurance_number', 50);
    table.string('blood_type', 5);
    table.text('allergies');
    table.text('medical_history');
    table.date('registration_date').notNullable();
    table.enum('status', ['active', 'inactive', 'deceased']).defaultTo('active');
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index(['last_name', 'first_name']);
    table.index('patient_id');
    table.index('registration_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('patients');
};
