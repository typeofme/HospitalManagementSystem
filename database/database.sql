DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS departments;
CREATE TABLE IF NOT EXISTS departments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  head_doctor_name VARCHAR(100),
  location VARCHAR(100),
  phone VARCHAR(20),
  capacity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_departments_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  department_id INT UNSIGNED,
  specialization VARCHAR(100),
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2),
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_doctors_last_first (last_name, first_name),
  INDEX idx_doctors_department_id (department_id),
  INDEX idx_doctors_employee_id (employee_id),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Doctor Status Log Table
CREATE TABLE IF NOT EXISTS doctor_status_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT UNSIGNED NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'status_change', 'department_change', 'archived'
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_doctor_status_log_doctor_id_created_at (doctor_id, created_at)
) ENGINE=InnoDB;

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(50),
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(50),
  insurance_number VARCHAR(50),
  blood_type VARCHAR(5),
  allergies TEXT,
  medical_history TEXT,
  registration_date DATE NOT NULL,
  status ENUM('active', 'inactive', 'deceased') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_patients_last_first (last_name, first_name),
  INDEX idx_patients_patient_id (patient_id),
  INDEX idx_patients_registration_date (registration_date)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_number VARCHAR(20) NOT NULL UNIQUE,
  patient_id INT UNSIGNED NOT NULL,
  doctor_id INT UNSIGNED NOT NULL,
  appointment_date DATETIME NOT NULL,
  duration_minutes INT DEFAULT 30,
  type VARCHAR(50) DEFAULT 'consultation',
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  reason TEXT,
  fee DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_appointments_patient_id (patient_id),
  INDEX idx_appointments_doctor_id (doctor_id),
  INDEX idx_appointments_appointment_date (appointment_date),
  INDEX idx_appointments_doctor_date (doctor_id, appointment_date),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  record_number VARCHAR(20) NOT NULL UNIQUE,
  patient_id INT UNSIGNED NOT NULL,
  doctor_id INT UNSIGNED NOT NULL,
  appointment_id INT UNSIGNED,
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  history_of_present_illness TEXT,
  physical_examination TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  vital_signs_blood_pressure_diastolic INT,
  vital_signs_heart_rate INT,
  vital_signs_respiratory_rate INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_medical_records_patient_id (patient_id),
  INDEX idx_medical_records_doctor_id (doctor_id),
  INDEX idx_medical_records_visit_date (visit_date),
  INDEX idx_medical_records_record_number (record_number),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

DELIMITER $$
CREATE FUNCTION GetCurrentPatientsCount()
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE patient_count INT;
  SELECT COUNT(*) INTO patient_count FROM patients WHERE status = 'active';
  RETURN patient_count;
END$$

CREATE FUNCTION CalculatePatientAge(patient_id INT, calculation_date DATE)
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE patient_age INT;
  DECLARE birth_date DATE;
  SELECT date_of_birth INTO birth_date FROM patients WHERE id = patient_id;
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  SET patient_age = TIMESTAMPDIFF(YEAR, birth_date, calculation_date);
  RETURN patient_age;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GenerateHospitalStats()
READS SQL DATA
BEGIN
  DECLARE total_patients INT;
  DECLARE total_doctors INT;
  DECLARE total_appointments INT;
  DECLARE avg_age DECIMAL(5,2);
  SELECT COUNT(*) INTO total_patients FROM patients WHERE status = 'active';
  SELECT COUNT(*) INTO total_doctors FROM doctors WHERE status = 'active';
  SELECT COUNT(*) INTO total_appointments FROM appointments;
  BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE patient_birth DATE;
    DECLARE age_sum INT DEFAULT 0;
    DECLARE patient_count INT DEFAULT 0;
    DECLARE patient_cursor CURSOR FOR SELECT date_of_birth FROM patients WHERE status = 'active' AND date_of_birth IS NOT NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN patient_cursor;
    patient_loop: LOOP
      FETCH patient_cursor INTO patient_birth;
      IF done THEN LEAVE patient_loop; END IF;
      SET age_sum = age_sum + TIMESTAMPDIFF(YEAR, patient_birth, CURDATE());
      SET patient_count = patient_count + 1;
    END LOOP;
    CLOSE patient_cursor;
    IF patient_count > 0 THEN SET avg_age = age_sum / patient_count; ELSE SET avg_age = 0; END IF;
  END;
  SELECT total_patients as 'Total Patients', total_doctors as 'Total Doctors', total_appointments as 'Total Appointments', avg_age as 'Average Patient Age';
END$$

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
  SELECT COUNT(*) INTO doctor_exists FROM doctors WHERE id = p_doctor_id AND status = 'active';
  SELECT COUNT(*) INTO patient_exists FROM patients WHERE id = p_patient_id AND status = 'active';
  IF doctor_exists = 0 THEN
    SET p_result_message = 'Error: Doctor not found or inactive';
    SET p_appointment_id = 0;
  ELSEIF patient_exists = 0 THEN
    SET p_result_message = 'Error: Patient not found or inactive';
    SET p_appointment_id = 0;
  ELSE
    SELECT COUNT(*) INTO time_conflict FROM appointments WHERE doctor_id = p_doctor_id AND DATE(appointment_date) = DATE(p_appointment_date) AND ABS(TIMESTAMPDIFF(MINUTE, appointment_date, p_appointment_date)) < 30 AND status NOT IN ('cancelled', 'no_show');
    IF time_conflict > 0 THEN
      SET p_result_message = 'Error: Time conflict with existing appointment';
      SET p_appointment_id = 0;
    ELSE
      SET appointment_number = CONCAT('APT', UNIX_TIMESTAMP());
      INSERT INTO appointments (appointment_number, patient_id, doctor_id, appointment_date, status, type, duration_minutes) VALUES (appointment_number, p_patient_id, p_doctor_id, p_appointment_date, 'scheduled', 'consultation', 30);
      SET p_appointment_id = LAST_INSERT_ID();
      SET p_result_message = CONCAT('Success: Appointment booked with ID ', p_appointment_id);
    END IF;
  END IF;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(50),
  operation VARCHAR(10),
  old_values JSON,
  new_values JSON,
  user VARCHAR(50),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE TRIGGER trg_before_appointment_insert
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
  IF NEW.appointment_date < NOW() THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date cannot be in the past';
  END IF;
  IF NEW.appointment_number IS NULL OR NEW.appointment_number = '' THEN
    SET NEW.appointment_number = CONCAT('APT', UNIX_TIMESTAMP(), '_', NEW.patient_id);
  END IF;
  IF NEW.duration_minutes IS NULL THEN
    SET NEW.duration_minutes = 30;
  END IF;
END$$

CREATE TRIGGER trg_after_patient_update
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
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
      'phone', OLD.phone
    ),
    JSON_OBJECT(
      'id', NEW.id,
      'patient_id', NEW.patient_id,
      'first_name', NEW.first_name,
      'last_name', NEW.last_name,
      'email', NEW.email,
      'phone', NEW.phone
    ),
    USER()
  );
END$$
DELIMITER ;

CREATE INDEX idx_patient_name_email ON patients (last_name, first_name, email);
CREATE INDEX idx_appointment_date_status ON appointments (appointment_date, status);
CREATE INDEX idx_medical_record_patient_date ON medical_records (patient_id, visit_date);
CREATE INDEX idx_doctor_dept_status_spec ON doctors (department_id, status, specialization);
CREATE INDEX idx_doctor_schedule ON appointments (doctor_id, appointment_date, status);
CREATE INDEX idx_patient_registration_status ON patients (registration_date, status, blood_type);
CREATE INDEX idx_appointment_comprehensive ON appointments (patient_id, doctor_id, appointment_date, status);

CREATE TABLE IF NOT EXISTS performance_test (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_data VARCHAR(100),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category_date (category_id, created_at)
);

-- Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  treatment_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cost DECIMAL(8,2),
  duration_minutes INT,
  category VARCHAR(50),
  equipment_required TEXT,
  precautions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_treatments_treatment_code (treatment_code),
  INDEX idx_treatments_category (category),
  INDEX idx_treatments_name (name)
);

-- Doctor Specializations Table
CREATE TABLE IF NOT EXISTS doctor_specializations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT UNSIGNED NOT NULL,
  treatment_id INT UNSIGNED NOT NULL,
  experience_years INT DEFAULT 0,
  proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
  certification_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_doctor_treatment (doctor_id, treatment_id),
  INDEX idx_doctor_specializations_doctor_id (doctor_id),
  INDEX idx_doctor_specializations_treatment_id (treatment_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'staff') DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_username (username),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_is_active (is_active)
);

-- Views
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
         p.date_of_birth, p.gender, p.blood_type, p.status, p.registration_date;

CREATE VIEW doctor_schedule_view AS
SELECT 
  d.id as doctor_id,
  d.employee_id,
  CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
  d.specialization,
  dept.name as department_name
FROM doctors d
INNER JOIN departments dept ON d.department_id = dept.id
WHERE d.status = 'active';

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
INNER JOIN doctor_schedule_view ds ON a.doctor_id = ds.doctor_id;

CREATE VIEW active_appointments_view AS
SELECT *
FROM appointment_details_view
WHERE status IN ('scheduled', 'confirmed', 'in_progress')
  AND appointment_date >= CURDATE()
WITH CHECK OPTION;

CREATE VIEW today_appointments_view AS
SELECT *
FROM active_appointments_view
WHERE DATE(appointment_date) = CURDATE()
WITH LOCAL CHECK OPTION;
