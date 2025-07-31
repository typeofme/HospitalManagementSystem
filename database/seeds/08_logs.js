exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('logs').del();
  await knex('logs').insert([
    {
      user_id: 1,
      action: 'CREATE',
      entity: 'User',
      entity_id: 1,
      description: 'Created admin user',
      created_at: knex.fn.now()
    },
    {
      user_id: 1,
      action: 'UPDATE',
      entity: 'Department',
      entity_id: 2,
      description: 'Updated department name',
      created_at: knex.fn.now()
    },
    {
      user_id: 2,
      action: 'DELETE',
      entity: 'Patient',
      entity_id: 5,
      description: 'Deleted patient record',
      created_at: knex.fn.now()
    }
  ]);
};
