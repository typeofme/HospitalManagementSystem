/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('doctor_specializations', (table) => {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable().references('id').inTable('doctors').onDelete('CASCADE');
    table.integer('treatment_id').unsigned().notNullable().references('id').inTable('treatments').onDelete('CASCADE');
    table.integer('experience_years').defaultTo(0);
    table.enum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert']).defaultTo('intermediate');
    table.date('certification_date');
    table.timestamps(true, true);
    
    // Unique constraint to prevent duplicate specializations
    table.unique(['doctor_id', 'treatment_id']);
    
    // Indexes for performance
    table.index('doctor_id');
    table.index('treatment_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('doctor_specializations');
};
