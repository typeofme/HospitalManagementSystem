/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('medical_records', (table) => {
    table.increments('id').primary();
    table.string('record_number', 20).unique().notNullable();
    table.integer('patient_id').unsigned().notNullable().references('id').inTable('patients').onDelete('CASCADE');
    table.integer('doctor_id').unsigned().notNullable().references('id').inTable('doctors').onDelete('CASCADE');
    table.integer('appointment_id').unsigned().references('id').inTable('appointments').onDelete('SET NULL');
    table.date('visit_date').notNullable();
    table.text('chief_complaint');
    table.text('history_of_present_illness');
    table.text('physical_examination');
    table.text('diagnosis');
    table.text('treatment_plan');
    table.text('medications_prescribed');
    table.text('lab_tests_ordered');
    table.text('follow_up_instructions');
    table.decimal('vital_signs_temperature', 4, 1);
    table.integer('vital_signs_blood_pressure_systolic');
    table.integer('vital_signs_blood_pressure_diastolic');
    table.integer('vital_signs_heart_rate');
    table.integer('vital_signs_respiratory_rate');
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index('patient_id');
    table.index('doctor_id');
    table.index('visit_date');
    table.index('record_number');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('medical_records');
};
