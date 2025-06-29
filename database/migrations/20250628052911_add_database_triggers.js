/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.raw(`
    -- Create audit log table for triggers
    CREATE TABLE IF NOT EXISTS audit_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      table_name VARCHAR(50),
      operation VARCHAR(10),
      old_values JSON,
      new_values JSON,
      user VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Trigger 1: BEFORE INSERT on appointments - validate scheduling
    CREATE TRIGGER trg_before_appointment_insert
    BEFORE INSERT ON appointments
    FOR EACH ROW
    BEGIN
      -- Validate appointment date is not in the past
      IF NEW.appointment_date < NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Appointment date cannot be in the past';
      END IF;
      
      -- Auto-generate appointment number if not provided
      IF NEW.appointment_number IS NULL OR NEW.appointment_number = '' THEN
        SET NEW.appointment_number = CONCAT('APT', UNIX_TIMESTAMP(), '_', NEW.patient_id);
      END IF;
      
      -- Set default duration if not specified
      IF NEW.duration_minutes IS NULL THEN
        SET NEW.duration_minutes = 30;
      END IF;
    END;
    
    -- Trigger 2: AFTER UPDATE on patients - log changes
    CREATE TRIGGER trg_after_patient_update
    AFTER UPDATE ON patients
    FOR EACH ROW
    BEGIN
      -- Log patient information changes
      INSERT INTO audit_log (table_name, operation, old_values, new_values, user)
      VALUES (
        'patients',
        'UPDATE',
        JSON_OBJECT(
          'id', OLD.id,
          'patient_id', OLD.patient_id,
          'first_name', OLD.first_name,
          'last_name', OLD.last_name,
          'email', OLD.email,
          'phone', OLD.phone,
          'status', OLD.status
        ),
        JSON_OBJECT(
          'id', NEW.id,
          'patient_id', NEW.patient_id,
          'first_name', NEW.first_name,
          'last_name', NEW.last_name,
          'email', NEW.email,
          'phone', NEW.phone,
          'status', NEW.status
        ),
        USER()
      );
    END;
    
    -- Trigger 3: BEFORE DELETE on doctors - prevent deletion if has active appointments
    CREATE TRIGGER trg_before_doctor_delete
    BEFORE DELETE ON doctors
    FOR EACH ROW
    BEGIN
      DECLARE active_appointments INT DEFAULT 0;
      
      -- Check for active appointments
      SELECT COUNT(*) INTO active_appointments
      FROM appointments
      WHERE doctor_id = OLD.id 
        AND appointment_date > NOW()
        AND status NOT IN ('cancelled', 'completed');
      
      -- Prevent deletion if doctor has future appointments
      IF active_appointments > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete doctor with active future appointments';
      END IF;
      
      -- Log the deletion attempt
      INSERT INTO audit_log (table_name, operation, old_values, new_values, user)
      VALUES (
        'doctors',
        'DELETE',
        JSON_OBJECT(
          'id', OLD.id,
          'employee_id', OLD.employee_id,
          'first_name', OLD.first_name,
          'last_name', OLD.last_name,
          'department_id', OLD.department_id,
          'status', OLD.status
        ),
        NULL,
        USER()
      );
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.raw(`
    DROP TRIGGER IF EXISTS trg_before_appointment_insert;
    DROP TRIGGER IF EXISTS trg_after_patient_update;
    DROP TRIGGER IF EXISTS trg_before_doctor_delete;
    DROP TABLE IF EXISTS audit_log;
  `);
};
