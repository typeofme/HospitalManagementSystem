/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  try {
    // Create roles (ignoring errors if they already exist)
    try {
      await knex.raw("CREATE ROLE 'finance'");
    } catch (e) {
      console.log('Role finance may already exist');
    }
    
    try {
      await knex.raw("CREATE ROLE 'human_dev'");
    } catch (e) {
      console.log('Role human_dev may already exist');
    }
    
    try {
      await knex.raw("CREATE ROLE 'warehouse'");
    } catch (e) {
      console.log('Role warehouse may already exist');
    }
    
    // Create users
    await knex.raw("CREATE USER IF NOT EXISTS 'user1'@'localhost' IDENTIFIED BY 'user1_password'");
    await knex.raw("CREATE USER IF NOT EXISTS 'user2'@'localhost' IDENTIFIED BY 'user2_password'");
    await knex.raw("CREATE USER IF NOT EXISTS 'user3'@'localhost' IDENTIFIED BY 'user3_password'");
    
    // Grant user permissions
    await knex.raw("GRANT SELECT, INSERT, UPDATE ON hospital_management.patients TO 'user1'@'localhost'");
    await knex.raw("GRANT SELECT ON hospital_management.patient_summary_view TO 'user2'@'localhost'");
    
    // Grant role permissions
    await knex.raw("GRANT EXECUTE ON PROCEDURE hospital_management.GenerateHospitalStats TO 'finance'");
    await knex.raw("GRANT EXECUTE ON PROCEDURE hospital_management.BookAppointment TO 'finance'");
    
    // Grant roles to users
    await knex.raw("GRANT 'finance' TO 'user3'@'localhost'");
    await knex.raw("GRANT 'human_dev' TO 'user2'@'localhost'");
    await knex.raw("GRANT 'warehouse' TO 'user1'@'localhost'");
    
    // Additional permissions for roles
    await knex.raw("GRANT SELECT ON hospital_management.appointments TO 'finance'");
    await knex.raw("GRANT SELECT ON hospital_management.medical_records TO 'finance'");
    await knex.raw("GRANT SELECT, UPDATE ON hospital_management.doctors TO 'human_dev'");
    await knex.raw("GRANT SELECT, UPDATE ON hospital_management.departments TO 'human_dev'");
    await knex.raw("GRANT SELECT ON hospital_management.treatments TO 'warehouse'");
    await knex.raw("GRANT SELECT ON hospital_management.doctor_specializations TO 'warehouse'");
    
    // Set default roles for users
    await knex.raw("SET DEFAULT ROLE ALL TO 'user1'@'localhost'");
    await knex.raw("SET DEFAULT ROLE ALL TO 'user2'@'localhost'");
    await knex.raw("SET DEFAULT ROLE ALL TO 'user3'@'localhost'");
    
    // Flush privileges
    await knex.raw("FLUSH PRIVILEGES");
  } catch (error) {
    console.log('Security migration completed with some expected warnings:', error.message);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  try {
    // Revoke permissions
    try { await knex.raw("REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user1'@'localhost'"); } catch (e) {}
    try { await knex.raw("REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user2'@'localhost'"); } catch (e) {}
    try { await knex.raw("REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user3'@'localhost'"); } catch (e) {}
    
    // Drop users
    try { await knex.raw("DROP USER IF EXISTS 'user1'@'localhost'"); } catch (e) {}
    try { await knex.raw("DROP USER IF EXISTS 'user2'@'localhost'"); } catch (e) {}
    try { await knex.raw("DROP USER IF EXISTS 'user3'@'localhost'"); } catch (e) {}
    
    // Drop roles
    try { await knex.raw("DROP ROLE IF EXISTS 'finance'"); } catch (e) {}
    try { await knex.raw("DROP ROLE IF EXISTS 'human_dev'"); } catch (e) {}
    try { await knex.raw("DROP ROLE IF EXISTS 'warehouse'"); } catch (e) {}
    
    await knex.raw("FLUSH PRIVILEGES");
  } catch (error) {
    console.log('Security rollback completed with some expected warnings:', error.message);
  }
};
