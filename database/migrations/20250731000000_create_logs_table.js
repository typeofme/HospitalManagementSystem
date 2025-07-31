exports.up = function(knex) {
  return knex.schema.createTable('logs', function(table) {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable();
    table.string('entity').notNullable();
    table.string('entity_id').nullable();
    table.text('description').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logs');
};
