/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('doctors', (table) => {
    table.increments('id').primary();
    table.string('employee_id', 20).unique().notNullable();
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('phone', 20);
    table.date('date_of_birth');
    table.enum('gender', ['male', 'female', 'other']);
    table.text('address');
    table.string('license_number', 50).unique().notNullable();
    table.integer('department_id').unsigned().references('id').inTable('departments').onDelete('SET NULL');
    table.string('specialization', 100);
    table.date('hire_date').notNullable();
    table.decimal('salary', 10, 2);
    table.enum('status', ['active', 'inactive', 'on_leave']).defaultTo('active');
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index(['last_name', 'first_name']);
    table.index('department_id');
    table.index('employee_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('doctors');
};
