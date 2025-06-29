/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(`
    -- Function 1: Calculate patient age (no parameters)
    CREATE FUNCTION GetCurrentPatientsCount()
    RETURNS INT
    READS SQL DATA
    DETERMINISTIC
    BEGIN
      DECLARE patient_count INT;
      SELECT COUNT(*) INTO patient_count FROM patients WHERE status = 'active';
      RETURN patient_count;
    END;
    
    -- Function 2: Calculate patient age by ID (with parameters)
    CREATE FUNCTION CalculatePatientAge(patient_id INT, calculation_date DATE)
    RETURNS INT
    READS SQL DATA
    DETERMINISTIC
    BEGIN
      DECLARE patient_age INT;
      DECLARE birth_date DATE;
      
      SELECT date_of_birth INTO birth_date 
      FROM patients 
      WHERE id = patient_id;
      
      IF birth_date IS NULL THEN
        RETURN NULL;
      END IF;
      
      SET patient_age = TIMESTAMPDIFF(YEAR, birth_date, calculation_date);
      RETURN patient_age;
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(`
    DROP FUNCTION IF EXISTS GetCurrentPatientsCount;
    DROP FUNCTION IF EXISTS CalculatePatientAge;
  `);
};
