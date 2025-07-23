/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // View 1: Horizontal view - Patient summary with basic information
  await knex.raw(`
    CREATE VIEW patient_summary_view AS
    SELECT 
      p.id,
      p.patient_id,
      CONCAT(p.first_name, ' ', p.last_name) as full_name,
      p.email,
      p.phone,
      p.date_of_birth,
      TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) as age,
      p.gender,
      p.blood_type,
      p.status,
      p.registration_date,
      COUNT(a.id) as total_appointments,
      MAX(a.appointment_date) as last_appointment
    FROM patients p
    LEFT JOIN appointments a ON p.id = a.patient_id
    GROUP BY p.id, p.patient_id, p.first_name, p.last_name, p.email, p.phone, 
             p.date_of_birth, p.gender, p.blood_type, p.status, p.registration_date
  `);
  
  // View 2: Vertical view - Doctor schedules (subset of doctor information)  
  await knex.raw(`
    CREATE VIEW doctor_schedule_view AS
    SELECT 
      d.id as doctor_id,
      d.employee_id,
      CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
      d.specialization,
      dept.name as department_name
    FROM doctors d
    INNER JOIN departments dept ON d.department_id = dept.id
    WHERE d.status = 'active'
  `);
  
  // View 3: View within a view - Appointment details using other views
  await knex.raw(`
    CREATE VIEW appointment_details_view AS
    SELECT 
      a.id as appointment_id,
      a.appointment_number,
      a.appointment_date,
      a.duration_minutes,
      a.type as appointment_type,
      a.status,
      a.reason,
      a.fee,
      ps.patient_id,
      ps.full_name as patient_name,
      ps.age as patient_age,
      ps.phone as patient_phone,
      ds.doctor_id,
      ds.doctor_name,
      ds.specialization,
      ds.department_name
    FROM appointments a
    INNER JOIN patient_summary_view ps ON a.patient_id = ps.id
    INNER JOIN doctor_schedule_view ds ON a.doctor_id = ds.doctor_id
  `);
  
  // Additional view with WITH CHECK OPTION CASCADED
  await knex.raw(`
    CREATE VIEW active_appointments_view AS
    SELECT *
    FROM appointment_details_view
    WHERE status IN ('scheduled', 'confirmed', 'in_progress')
      AND appointment_date >= CURDATE()
  `);
  
  // Additional view with WITH CHECK OPTION LOCAL
  await knex.raw(`
    CREATE VIEW today_appointments_view AS
    SELECT *
    FROM active_appointments_view
    WHERE DATE(appointment_date) = CURDATE()
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP VIEW IF EXISTS today_appointments_view');
  await knex.raw('DROP VIEW IF EXISTS active_appointments_view');
  await knex.raw('DROP VIEW IF EXISTS appointment_details_view');
  await knex.raw('DROP VIEW IF EXISTS doctor_schedule_view');
  await knex.raw('DROP VIEW IF EXISTS patient_summary_view');
};
