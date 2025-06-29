/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Procedure 1: Generate Hospital Statistics (no parameters)
  await knex.raw(`
    CREATE PROCEDURE GenerateHospitalStats()
    READS SQL DATA
    BEGIN
      DECLARE total_patients INT;
      DECLARE total_doctors INT;
      DECLARE total_appointments INT;
      DECLARE avg_age DECIMAL(5,2);
      
      -- Get statistics
      SELECT COUNT(*) INTO total_patients FROM patients WHERE status = 'active';
      SELECT COUNT(*) INTO total_doctors FROM doctors WHERE status = 'active';
      SELECT COUNT(*) INTO total_appointments FROM appointments;
      
      -- Calculate average patient age using cursor
      BEGIN
        DECLARE done INT DEFAULT FALSE;
        DECLARE patient_birth DATE;
        DECLARE age_sum INT DEFAULT 0;
        DECLARE patient_count INT DEFAULT 0;
        
        DECLARE patient_cursor CURSOR FOR 
          SELECT date_of_birth FROM patients WHERE status = 'active' AND date_of_birth IS NOT NULL;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        
        OPEN patient_cursor;
        
        patient_loop: LOOP
          FETCH patient_cursor INTO patient_birth;
          IF done THEN
            LEAVE patient_loop;
          END IF;
          
          SET age_sum = age_sum + TIMESTAMPDIFF(YEAR, patient_birth, CURDATE());
          SET patient_count = patient_count + 1;
        END LOOP;
        
        CLOSE patient_cursor;
        
        IF patient_count > 0 THEN
          SET avg_age = age_sum / patient_count;
        ELSE
          SET avg_age = 0;
        END IF;
      END;
      
      -- Return results
      SELECT 
        total_patients as 'Total Patients',
        total_doctors as 'Total Doctors', 
        total_appointments as 'Total Appointments',
        avg_age as 'Average Patient Age';
    END
  `);
  
  // Procedure 2: Book appointment with validation (with parameters)
  await knex.raw(`
    CREATE PROCEDURE BookAppointment(
      IN p_patient_id INT,
      IN p_doctor_id INT,
      IN p_appointment_date DATETIME,
      OUT p_appointment_id INT,
      OUT p_result_message VARCHAR(255)
    )
    MODIFIES SQL DATA
    BEGIN
      DECLARE doctor_exists INT DEFAULT 0;
      DECLARE patient_exists INT DEFAULT 0;
      DECLARE time_conflict INT DEFAULT 0;
      DECLARE appointment_number VARCHAR(20);
      
      -- Check if doctor exists and is active
      SELECT COUNT(*) INTO doctor_exists 
      FROM doctors 
      WHERE id = p_doctor_id AND status = 'active';
      
      -- Check if patient exists and is active
      SELECT COUNT(*) INTO patient_exists 
      FROM patients 
      WHERE id = p_patient_id AND status = 'active';
      
      -- Validation using IF statements
      IF doctor_exists = 0 THEN
        SET p_result_message = 'Error: Doctor not found or inactive';
        SET p_appointment_id = 0;
      ELSEIF patient_exists = 0 THEN
        SET p_result_message = 'Error: Patient not found or inactive';
        SET p_appointment_id = 0;
      ELSE
        -- Check for time conflicts
        SELECT COUNT(*) INTO time_conflict
        FROM appointments
        WHERE doctor_id = p_doctor_id 
          AND DATE(appointment_date) = DATE(p_appointment_date)
          AND ABS(TIMESTAMPDIFF(MINUTE, appointment_date, p_appointment_date)) < 30
          AND status NOT IN ('cancelled', 'no_show');
        
        IF time_conflict > 0 THEN
          SET p_result_message = 'Error: Time conflict with existing appointment';
          SET p_appointment_id = 0;
        ELSE
          -- Generate appointment number
          SET appointment_number = CONCAT('APT', UNIX_TIMESTAMP());
          
          -- Insert appointment
          INSERT INTO appointments (
            appointment_number, patient_id, doctor_id, appointment_date, 
            status, type, duration_minutes
          ) VALUES (
            appointment_number, p_patient_id, p_doctor_id, p_appointment_date,
            'scheduled', 'consultation', 30
          );
          
          SET p_appointment_id = LAST_INSERT_ID();
          SET p_result_message = CONCAT('Success: Appointment booked with ID ', p_appointment_id);
        END IF;
      END IF;
    END
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP PROCEDURE IF EXISTS BookAppointment');
  await knex.raw('DROP PROCEDURE IF EXISTS GenerateHospitalStats');
};
