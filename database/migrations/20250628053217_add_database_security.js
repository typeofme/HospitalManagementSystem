/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(`
    -- Create roles
    CREATE ROLE IF NOT EXISTS 'finance';
    CREATE ROLE IF NOT EXISTS 'human_dev';
    CREATE ROLE IF NOT EXISTS 'warehouse';
    
    -- Create users
    CREATE USER IF NOT EXISTS 'user1'@'localhost' IDENTIFIED BY 'user1_password';
    CREATE USER IF NOT EXISTS 'user2'@'localhost' IDENTIFIED BY 'user2_password';
    CREATE USER IF NOT EXISTS 'user3'@'localhost' IDENTIFIED BY 'user3_password';
    
    -- Grant user1 access to patients table
    GRANT SELECT, INSERT, UPDATE ON hospital_management.patients TO 'user1'@'localhost';
    
    -- Grant user2 access to patient_summary_view
    GRANT SELECT ON hospital_management.patient_summary_view TO 'user2'@'localhost';
    
    -- Grant finance role access to procedures
    GRANT EXECUTE ON PROCEDURE hospital_management.GenerateHospitalStats TO 'finance';
    GRANT EXECUTE ON PROCEDURE hospital_management.BookAppointment TO 'finance';
    
    -- Grant roles to users
    GRANT 'finance' TO 'user3'@'localhost';
    GRANT 'human_dev' TO 'user2'@'localhost';
    GRANT 'warehouse' TO 'user1'@'localhost';
    
    -- Additional permissions for roles
    GRANT SELECT ON hospital_management.appointments TO 'finance';
    GRANT SELECT ON hospital_management.medical_records TO 'finance';
    
    GRANT SELECT, UPDATE ON hospital_management.doctors TO 'human_dev';
    GRANT SELECT, UPDATE ON hospital_management.departments TO 'human_dev';
    
    GRANT SELECT ON hospital_management.treatments TO 'warehouse';
    GRANT SELECT ON hospital_management.doctor_specializations TO 'warehouse';
    
    -- Set default roles for users
    SET DEFAULT ROLE ALL TO 'user1'@'localhost';
    SET DEFAULT ROLE ALL TO 'user2'@'localhost';
    SET DEFAULT ROLE ALL TO 'user3'@'localhost';
    
    -- Flush privileges
    FLUSH PRIVILEGES;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(`
    -- Revoke permissions
    REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user1'@'localhost';
    REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user2'@'localhost';
    REVOKE ALL PRIVILEGES ON hospital_management.* FROM 'user3'@'localhost';
    
    -- Drop users
    DROP USER IF EXISTS 'user1'@'localhost';
    DROP USER IF EXISTS 'user2'@'localhost';
    DROP USER IF EXISTS 'user3'@'localhost';
    
    -- Drop roles
    DROP ROLE IF EXISTS 'finance';
    DROP ROLE IF EXISTS 'human_dev';
    DROP ROLE IF EXISTS 'warehouse';
    
    FLUSH PRIVILEGES;
  `);
};
