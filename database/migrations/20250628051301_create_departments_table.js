/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('departments', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.text('description');
    table.string('head_doctor_name', 100);
    table.string('location', 100);
    table.string('phone', 20);
    table.integer('capacity').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Index for searching by name
    table.index('name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('departments');
};
