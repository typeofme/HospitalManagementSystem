exports.up = async function (knex) {
  // Drop procedures if they exist
  await knex.raw("DROP PROCEDURE IF EXISTS ArchiveInactiveDoctors");
  await knex.raw("DROP PROCEDURE IF EXISTS AssignDoctorToDepartment");

  // Create doctor_status_log table if it doesn't exist (for logging department changes)
  const hasStatusLogTable = await knex.schema.hasTable("doctor_status_log");
  if (!hasStatusLogTable) {
    await knex.schema.createTable("doctor_status_log", function (table) {
      table.increments("id").primary();
      table.integer("doctor_id").unsigned().notNullable();
      table.string("action_type", 50).notNullable(); // 'status_change', 'department_change', 'archived'
      table.string("old_value", 100);
      table.string("new_value", 100);
      table.text("notes");
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table.foreign("doctor_id").references("doctors.id").onDelete("CASCADE");
      table.index(["doctor_id", "created_at"]);
    });
  }

  // Create ArchiveInactiveDoctors procedure with cursor
  await knex.raw(`
    CREATE PROCEDURE ArchiveInactiveDoctors()
    BEGIN
      DECLARE affected_count INT DEFAULT 0;
      DECLARE done INT DEFAULT FALSE;
      
      -- Variables for cursor
      DECLARE v_doctor_id INT;
      DECLARE v_employee_id VARCHAR(20);
      DECLARE v_first_name VARCHAR(100);
      DECLARE v_last_name VARCHAR(100);
      DECLARE v_department_name VARCHAR(100);
      DECLARE v_updated_at DATETIME;
      DECLARE v_appointment_count INT DEFAULT 0;
      DECLARE v_inactive_days INT DEFAULT 0;
      
      -- Cursor to select inactive doctors
      DECLARE doctor_cursor CURSOR FOR
        SELECT 
          d.id,
          d.employee_id,
          d.first_name,
          d.last_name,
          dept.name as department_name,
          d.updated_at,
          DATEDIFF(NOW(), d.updated_at) as inactive_days
        FROM doctors d
        LEFT JOIN departments dept ON d.department_id = dept.id
        WHERE d.status = 'inactive' 
        AND d.updated_at < DATE_SUB(NOW(), INTERVAL 6 MONTH)
        ORDER BY d.updated_at ASC;
      
      -- Handler for cursor
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
      
      -- Open cursor and process each doctor
      OPEN doctor_cursor;
      
      doctor_loop: LOOP
        FETCH doctor_cursor INTO v_doctor_id, v_employee_id, v_first_name, v_last_name, v_department_name, v_updated_at, v_inactive_days;
        
        IF done THEN
          LEAVE doctor_loop;
        END IF;
        
        -- Get appointment count for this doctor
        SELECT COUNT(*) INTO v_appointment_count
        FROM appointments 
        WHERE doctor_id = v_doctor_id;
        
        -- Archive the doctor
        UPDATE doctors 
        SET status = 'archived', 
            updated_at = NOW() 
        WHERE id = v_doctor_id;
        
        -- Log detailed archive information
        INSERT INTO doctor_status_log (doctor_id, action_type, old_value, new_value, notes)
        VALUES (
          v_doctor_id,
          'archived',
          'inactive',
          'archived',
          CONCAT(
            'Dr. ', v_first_name, ' ', v_last_name, 
            ' (', v_employee_id, ') from ', IFNULL(v_department_name, 'No Department'),
            ' archived after ', v_inactive_days, ' days of inactivity. ',
            'Total appointments: ', v_appointment_count, '. ',
            'Last activity: ', v_updated_at, '. ',
            'Archived on: ', NOW()
          )
        );
        
        SET affected_count = affected_count + 1;
        
      END LOOP;
      
      CLOSE doctor_cursor;
      
      -- Return detailed results
      SELECT 
        affected_count as archived_count,
        CASE 
          WHEN affected_count = 0 THEN 'No inactive doctors found to archive'
          WHEN affected_count = 1 THEN 'Successfully archived 1 doctor'
          ELSE CONCAT('Successfully archived ', affected_count, ' doctors')
        END as message,
        NOW() as archived_at;
    END
  `);

  // Create AssignDoctorToDepartment procedure
  await knex.raw(`
    CREATE PROCEDURE AssignDoctorToDepartment(IN doctor_id INT, IN department_id INT)
    BEGIN
      DECLARE dept_exists INT DEFAULT 0;
      DECLARE doctor_exists INT DEFAULT 0;
      DECLARE old_dept_id INT;
      DECLARE old_dept_name VARCHAR(100);
      DECLARE new_dept_name VARCHAR(100);
      DECLARE result_status VARCHAR(20);
      DECLARE result_message VARCHAR(255);
      
      -- Check if doctor exists
      SELECT COUNT(*), d.department_id INTO doctor_exists, old_dept_id
      FROM doctors d 
      WHERE d.id = doctor_id;
      
      -- Check if department exists
      SELECT COUNT(*) INTO dept_exists FROM departments WHERE id = department_id;
      
      -- Get department names for logging
      SELECT name INTO old_dept_name FROM departments WHERE id = old_dept_id;
      SELECT name INTO new_dept_name FROM departments WHERE id = department_id;
      
      IF doctor_exists = 0 THEN
        SET result_status = 'ERROR';
        SET result_message = 'Doctor not found';
      ELSEIF dept_exists = 0 THEN
        SET result_status = 'ERROR';
        SET result_message = 'Department does not exist';
      ELSEIF old_dept_id = department_id THEN
        SET result_status = 'WARNING';
        SET result_message = 'Doctor is already assigned to this department';
      ELSE
        -- Update doctor's department
        UPDATE doctors 
        SET department_id = department_id, 
            updated_at = NOW() 
        WHERE id = doctor_id;
        
        -- Log the department change
        INSERT INTO doctor_status_log (doctor_id, action_type, old_value, new_value, notes)
        VALUES (
          doctor_id, 
          'department_change', 
          old_dept_name, 
          new_dept_name,
          CONCAT('Department changed from ', IFNULL(old_dept_name, 'None'), ' to ', new_dept_name, ' on ', NOW())
        );
        
        SET result_status = 'SUCCESS';
        SET result_message = CONCAT('Doctor assigned to ', new_dept_name, ' successfully');
      END IF;
      
      -- Return result
      SELECT result_status as status, 
             result_message as message,
             doctor_id as doctor_id,
             department_id as new_department_id,
             new_dept_name as department_name,
             NOW() as updated_at;
    END
  `);
};

exports.down = async function (knex) {
  // Drop procedures
  await knex.raw("DROP PROCEDURE IF EXISTS ArchiveInactiveDoctors");
  await knex.raw("DROP PROCEDURE IF EXISTS AssignDoctorToDepartment");

  // Optionally drop the status log table (commented out to preserve data)
  // await knex.schema.dropTableIfExists('doctor_status_log');
};
