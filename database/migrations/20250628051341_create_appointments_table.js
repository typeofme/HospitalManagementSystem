/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('appointments', (table) => {
    table.increments('id').primary();
    table.string('appointment_number', 20).unique().notNullable();
    table.integer('patient_id').unsigned().notNullable().references('id').inTable('patients').onDelete('CASCADE');
    table.integer('doctor_id').unsigned().notNullable().references('id').inTable('doctors').onDelete('CASCADE');
    table.datetime('appointment_date').notNullable();
    table.integer('duration_minutes').defaultTo(30);
    table.string('type', 50).defaultTo('consultation');
    table.enum('status', ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).defaultTo('scheduled');
    table.text('reason');
    table.text('notes');
    table.decimal('fee', 8, 2);
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index('patient_id');
    table.index('doctor_id');
    table.index('appointment_date');
    table.index(['doctor_id', 'appointment_date']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('appointments');
};
