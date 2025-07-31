exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('audit_log').del();
  await knex('audit_log').insert([
    {
      table_name: 'users',
      operation: 'INSERT',
      old_values: null,
      new_values: JSON.stringify({ id: 1, username: 'admin', email: 'admin@hospital.com' }),
      user: 'system',
      timestamp: knex.fn.now()
    },
    {
      table_name: 'departments',
      operation: 'UPDATE',
      old_values: JSON.stringify({ id: 2, name: 'Cardiology' }),
      new_values: JSON.stringify({ id: 2, name: 'Cardiology & Heart' }),
      user: 'admin',
      timestamp: knex.fn.now()
    },
    {
      table_name: 'patients',
      operation: 'DELETE',
      old_values: JSON.stringify({ id: 5, name: 'John Doe' }),
      new_values: null,
      user: 'doctor1',
      timestamp: knex.fn.now()
    }
  ]);
};
