/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 50).unique().notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.enum('role', ['admin', 'doctor', 'nurse', 'staff']).defaultTo('staff');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_login').nullable();
    table.string('avatar_url', 255).nullable();
    table.timestamps(true, true);
    
    // Indexes for performance
    table.index('username');
    table.index('email');
    table.index('role');
    table.index('is_active');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
