/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    // Method 1: Create index when creating new table (demonstration table)
    knex.schema.createTable('performance_test', (table) => {
      table.increments('id').primary();
      table.string('test_data', 100);
      table.integer('category_id');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Create index during table creation
      table.index(['category_id', 'created_at'], 'idx_category_date');
    }),
    
    // Method 2: Create index using CREATE INDEX (via raw SQL)
    knex.schema.raw(`
      CREATE INDEX idx_patient_name_email 
      ON patients (last_name, first_name, email);
    `),
    
    knex.schema.raw(`
      CREATE INDEX idx_appointment_date_status 
      ON appointments (appointment_date, status);
    `),
    
    knex.schema.raw(`
      CREATE INDEX idx_medical_record_patient_date 
      ON medical_records (patient_id, visit_date);
    `),
    
    // Method 3: Create index using ALTER TABLE
    knex.schema.alterTable('doctors', (table) => {
      table.index(['department_id', 'status', 'specialization'], 'idx_doctor_dept_status_spec');
    }),
    
    knex.schema.alterTable('appointments', (table) => {
      table.index(['doctor_id', 'appointment_date', 'status'], 'idx_doctor_schedule');
    }),
    
    // Composite indexes for performance on large datasets
    knex.schema.raw(`
      CREATE INDEX idx_patient_registration_status 
      ON patients (registration_date, status, blood_type);
    `),
    
    knex.schema.raw(`
      CREATE INDEX idx_appointment_comprehensive 
      ON appointments (patient_id, doctor_id, appointment_date, status);
    `)
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('performance_test'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_patient_name_email ON patients'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_appointment_date_status ON appointments'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_medical_record_patient_date ON medical_records'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_doctor_dept_status_spec ON doctors'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_doctor_schedule ON appointments'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_patient_registration_status ON patients'),
    knex.schema.raw('DROP INDEX IF EXISTS idx_appointment_comprehensive ON appointments')
  ]);
};
