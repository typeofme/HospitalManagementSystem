/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('treatments', (table) => {
    table.increments('id').primary();
    table.string('treatment_code', 20).unique().notNullable();
    table.string('name', 100).notNullable();
    table.text('description');
    table.decimal('cost', 8, 2);
    table.integer('duration_minutes');
    table.string('category', 50);
    table.text('equipment_required');
    table.text('precautions');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index('treatment_code');
    table.index('category');
    table.index('name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('treatments');
};
