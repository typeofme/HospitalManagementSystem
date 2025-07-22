# 🏥 Hospital Patient Management System

A comprehensive, full-stack hospital management system built with Node.js, Express.js, and MySQL. This system provides a modern, secure, and user-friendly interface for managing hospital operations including patient records, doctor schedules, appointments, medical records, and treatments. The system features advanced database programming concepts, modern UI/UX design, and enterprise-level security.

## 📊 Project Status

### 🎯 **ASSIGNMENT REQUIREMENTS COMPLIANCE**

Based on the Database Programming course requirements, here's how this project fulfills each task:

#### **TASK 1: Database Creation (✅ COMPLETE)**
**Requirements**: Database with 5+ tables, 20+ rows each, relationships, large dataset for indexing

| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **5+ Tables** | 8 tables implemented | ✅ **EXCEEDED** |
| **20+ Rows Each** | patients(5000+), appointments(8000+), medical_records(3000+), others(20+) | ✅ **EXCEEDED** |
| **Large Dataset (1000-10,000)** | Multiple tables with 1000+ records | ✅ **COMPLETE** |
| **One-to-One** | users ↔ doctors | ✅ **COMPLETE** |
| **One-to-Many** | departments→doctors, patients→appointments, patients→medical_records | ✅ **COMPLETE** |
| **Many-to-Many** | doctors ↔ treatments (via doctor_specializations) | ✅ **COMPLETE** |
| **SQL File** | Available in GitHub repository | **NOT DONE** |
| **ERD Schema** | Database schema documented | **NOT DONE** |
| **Screenshots** | Tables and data screenshots | **NOT DONE** |
| **Web Application** | Full-stack web app implemented | ✅ **COMPLETE** |

#### **TASK 2: Database Programming Features**

##### **Functions (SCPMK 1161508 – 15 points) ✅ COMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **Function with no parameters** | `GetCurrentPatientsCount()`, `get_total_doctors()` | ✅ **IMPLEMENTED** |
| **Function with parameters** | `CalculatePatientAge(patient_id, calculation_date)`, `get_doctors_by_department(dept_id)` | ✅ **IMPLEMENTED** |
| **Execute functions** | `SELECT GetCurrentPatientsCount(); SELECT get_total_doctors();` | ✅ **IMPLEMENTED** |
| **Show function list** | `SHOW FUNCTION STATUS WHERE Db = 'hospital_management';` | ✅ **IMPLEMENTED** |

##### **Procedures (SCPMK 1161508 – 15 points) ✅ COMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **Procedure with no parameters** | `GenerateHospitalStats()`, `ArchiveInactiveDoctors()` with cursor | ✅ **IMPLEMENTED** |
| **Procedure with parameters** | `BookAppointment(IN, IN, IN, OUT, OUT)`, `AssignDoctorToDepartment(IN, IN)` | ✅ **IMPLEMENTED** |
| **Control flow (IF/CASE/LOOP)** | All procedures include IF statements, loops, and complex logic | ✅ **IMPLEMENTED** |
| **Cursor usage** | `ArchiveInactiveDoctors()` uses cursor for row-by-row processing | ✅ **IMPLEMENTED** |
| **Execute procedures** | `CALL GenerateHospitalStats(); CALL ArchiveInactiveDoctors();` | ✅ **IMPLEMENTED** |
| **Show procedure list** | `SHOW PROCEDURE STATUS WHERE Db = 'hospital_management';` | ✅ **IMPLEMENTED** |

##### **Triggers (SCPMK 1163809 – 15 points) INCOMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **3 Different trigger types** | BEFORE INSERT, AFTER UPDATE, BEFORE DELETE | ✅ **COMPLETE** |
| **BEFORE INSERT** | `trg_before_appointment_insert` with NEW parameter | ✅ **COMPLETE** |
| **AFTER UPDATE** | `trg_after_patient_update` with OLD/NEW parameters | ✅ **COMPLETE** |
| **BEFORE DELETE** | `trg_before_doctor_delete` with OLD parameter | ✅ **COMPLETE** |
| **NEW/OLD parameters** | All triggers use appropriate NEW/OLD parameters | ✅ **COMPLETE** |
| **Control flow** | Triggers include IF statements and validation | ✅ **COMPLETE** |
| **Execute events** | Triggers fire on INSERT/UPDATE/DELETE operations | ✅ **COMPLETE** |
| **Show trigger list** | `SHOW TRIGGERS;` | **NOT DONE** |

##### **Indexes (SCPMK 1161510 – 10 points) INCOMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **Index during table creation** | Primary keys and foreign keys with automatic indexing | ✅ **COMPLETE** |
| **CREATE INDEX** | `idx_patient_name_email`, `idx_appointment_date_status` | ✅ **COMPLETE** |
| **ALTER TABLE index** | `idx_doctor_dept_status` on doctors table | ✅ **COMPLETE** |
| **Composite indexes** | Multi-column indexes implemented | **NOT DONE** |
| **EXPLAIN statements** | Performance comparison with/without indexes | **NOT DONE** |
| **Show index list** | `SHOW INDEX FROM table_name;` | **NOT DONE** |

##### **Views (SCPMK 1161611 – 10 points) INCOMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **Horizontal view** | `patient_summary_view` with aggregated data | **NOT DONE** |
| **Vertical view** | `doctor_schedule_view` with filtered columns | **NOT DONE** |
| **View within view** | `appointment_details_view` using other views | **NOT DONE** |
| **WITH CHECK OPTION** | Cascaded and local check options implemented | **NOT DONE** |
| **UPDATE/INSERT via views** | Operations through views with validation | **NOT DONE** |
| **Show view list** | `SHOW FULL TABLES WHERE Table_type = 'VIEW';` | **NOT DONE** |

##### **Database Security (SCPMK 1163812 – 15 points) INCOMPLETE**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **3 Users** | user1@localhost, user2@localhost, user3@localhost | **NOT DONE** |
| **3 Roles** | finance, human_dev, warehouse | **NOT DONE** |
| **User1 table access** | GRANT SELECT,INSERT,UPDATE,DELETE ON patients TO user1 | **NOT DONE** |
| **User2 view access** | GRANT SELECT ON patient_summary_view TO user2 | **NOT DONE** |
| **Role procedure access** | GRANT EXECUTE ON GenerateHospitalStats TO finance | **NOT DONE** |
| **Privilege testing** | Login tests with different users/roles | **NOT DONE** |

#### **TASK 3: Web Integration (20 points) ALMOST**
| Requirement | Implementation | Status |
|-------------|----------------|---------|
| **Web-based environment** | Full-stack Express.js web application | ✅ **COMPLETE** |
| **Dashboard template** | Modern Bootstrap 5 dashboard with glassmorphism | ✅ **COMPLETE** |
| **CRUD Implementation** | Complete Create, Read, Update, Delete for all entities | ✅ **COMPLETE** |
| **Same database** | All tasks use hospital_management database | ✅ **COMPLETE** |
| **Screenshots ready** | Database features via SQL screenshots | 🔄 **NEEDS COMPLETION** |

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Database**: MySQL 8.0+
- **ORM/Query Builder**: Knex.js 3.1.0 with migrations and seeds
- **Authentication**: bcrypt 6.0.0, express-session 1.18.1
- **Security**: Helmet.js 8.1.0, CORS 2.8.5, express-rate-limit 7.5.1
- **Validation**: express-validator 7.2.1

### Frontend
- **Template Engine**: EJS 3.1.10 (Embedded JavaScript)
- **CSS Framework**: Bootstrap 5.3+ with custom themes
- **Icons**: Font Awesome 6+
- **JavaScript**: Vanilla ES6+ with modern features
- **Design**: Custom CSS with glassmorphism effects and animations

### Development Tools
- **Process Manager**: Nodemon 3.1.10
- **Environment**: dotenv 17.0.0
- **Database Migrations**: Knex migrations with version control
- **Data Seeding**: Faker.js 9.8.0 for realistic test data (5000+ records)
- **Logging**: Morgan 1.10.0
- **File Upload**: Multer 2.0.1

### Additional Dependencies
- **JWT**: jsonwebtoken 9.0.2 for token-based authentication
- **Session Storage**: connect-redis 9.0.0 for session management
- **Security**: Content Security Policy with proper headers

## 📁 Project Structure

```
pbd/
├── 📂 database/
│   ├── 📂 migrations/              # Database schema migrations
│   │   ├── 20250628051301_create_departments_table.js
│   │   ├── 20250628051320_create_doctors_table.js
│   │   ├── 20250628051331_create_patients_table.js
│   │   ├── 20250628051341_create_appointments_table.js
│   │   ├── 20250628051402_create_medical_records_table.js
│   │   ├── 20250628051414_create_treatments_table.js
│   │   ├── 20250628051423_create_doctor_specializations_table.js
│   │   ├── 20250628052851_add_database_functions.js
│   │   ├── 20250628052902_add_database_procedures.js
│   │   ├── 20250628052911_add_database_triggers.js
│   │   ├── 20250628052920_add_database_indexes.js
│   │   ├── 20250628052934_add_database_views.js
│   │   ├── 20250628053217_add_database_security.js
│   │   └── 20250629100000_create_users_table.js
│   ├── 📂 seeds/                   # Database seeders with sample data
│   │   ├── 01_departments.js       # Hospital departments
│   │   ├── 02_doctors.js          # Doctor profiles
│   │   ├── 03_patients.js         # Patient records (5000+)
│   │   ├── 04_treatments.js       # Treatment protocols
│   │   ├── 05_appointments.js     # Appointments (8000+)
│   │   ├── 05_users.js           # System users
│   │   ├── 06_medical_records.js  # Medical records (3000+)
│   │   └── 07_doctor_specializations.js
│   └── connection.js              # Database connection configuration
├── 📂 public/
│   ├── 📂 js/                     # Client-side JavaScript
│   │   ├── common.js              # Shared utilities and notifications
│   │   ├── patients.js            # Patient management
│   │   ├── doctors.js             # Doctor management
│   │   ├── appointments.js        # Appointment scheduling
│   │   ├── medical-records.js     # Medical record management
│   │   ├── treatments.js          # Treatment management
│   │   └── users.js              # User management
│   ├── 📂 css/                    # Custom stylesheets
│   └── ui-test.html              # UI testing page
├── 📂 src/
│   ├── 📂 controllers/            # Business logic controllers
│   │   ├── PatientController.js   # Patient CRUD operations
│   │   ├── DoctorController.js    # Doctor management
│   │   ├── AppointmentController.js # Appointment logic
│   │   ├── MedicalRecordController.js # Medical records
│   │   ├── TreatmentController.js # Treatment protocols
│   │   ├── DepartmentController.js # Department management
│   │   ├── UserController.js      # User management
│   │   └── AuthController.js      # Authentication logic
│   ├── 📂 middleware/             # Custom middleware
│   │   └── auth.js               # Authentication & authorization
│   ├── 📂 models/                # Database models
│   │   ├── Patient.js            # Patient model
│   │   ├── Doctor.js             # Doctor model
│   │   ├── Appointment.js        # Appointment model
│   │   └── User.js               # User model
│   ├── 📂 routes/                # API and web routes
│   │   ├── web.js                # Web interface routes
│   │   ├── auth.js               # Authentication routes
│   │   ├── users.js              # User management routes
│   │   ├── userApi.js            # User API endpoints
│   │   ├── patients.js           # Patient API routes
│   │   ├── doctors.js            # Doctor API routes
│   │   ├── appointments.js       # Appointment API routes
│   │   ├── medicalRecords.js     # Medical records API
│   │   ├── treatments.js         # Treatment API routes
│   │   └── departments.js        # Department API routes
│   └── app.js                    # Application entry point
├── 📂 views/
│   ├── 📂 auth/                  # Authentication views
│   │   └── login.ejs            # Login page
│   ├── 📂 partials/             # Reusable view components
│   │   └── footer.ejs           # Footer component
│   ├── layout.ejs               # Main layout template
│   ├── modern-layout.ejs        # Modern layout with glassmorphism
│   ├── dashboard.ejs            # Dashboard overview
│   ├── patients.ejs             # Patient management page
│   ├── doctors.ejs              # Doctor management page
│   ├── appointments.ejs         # Appointment scheduling
│   ├── medical-records.ejs      # Medical records management
│   ├── treatments.ejs           # Treatment management
│   ├── users.ejs               # User management
│   └── *.ejs                   # Detail pages for each entity
├── 📂 scripts/                  # Utility scripts
│   └── create-database.js       # Database creation script
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── knexfile.js                  # Knex configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## Database Requirements 

### ✅ Database Relationships (All Types Implemented)
- **One-to-One**: users ↔ doctors (each doctor has one user account)
- **One-to-Many**: 
  - departments → doctors (each department has multiple doctors)
  - patients → appointments (each patient can have multiple appointments)
  - patients → medical_records (each patient has multiple medical records)
  - doctors → appointments (each doctor handles multiple appointments)
- **Many-to-Many**: 
  - doctors ↔ treatments (via doctor_specializations pivot table)

### ✅ Advanced Database Programming

#### 📊 Functions (4 Functions)
1. **`GetCurrentPatientsCount()`** - No parameters
   - Returns count of active patients
   - Usage: `SELECT GetCurrentPatientsCount();`

2. **`CalculatePatientAge(patient_id, calculation_date)`** - With parameters
   - Calculates patient age based on birth date
   - Usage: `SELECT CalculatePatientAge(1, CURDATE());`

3. **`get_total_doctors()`** - No parameters
   - Returns total count of doctors in the system
   - Usage: `SELECT get_total_doctors();`

4. **`get_doctors_by_department(dept_id)`** - With parameters
   - Returns count of doctors in a specific department
   - Usage: `SELECT get_doctors_by_department(1);`

#### 🔧 Stored Procedures (4 Procedures with Control Flow & Cursor)
1. **`GenerateHospitalStats()`** - No parameters
   - Generates comprehensive hospital statistics
   - Uses cursor for age calculation
   - Includes IF statements and loops
   - Usage: `CALL GenerateHospitalStats();`

2. **`BookAppointment(IN patient_id, IN doctor_id, IN appointment_date, OUT appointment_id, OUT result_message)`**
   - Complex appointment booking with validation
   - Uses IF-ELSE control flow
   - Includes conflict detection
   - Usage: `CALL BookAppointment(1, 1, '2024-12-01 10:00:00', @apt_id, @msg);`

3. **`ArchiveInactiveDoctors()`** - No parameters with cursor
   - Archives doctors inactive for more than 6 months
   - Uses cursor for row-by-row processing with detailed logging
   - Includes complex control flow (LOOP, IF statements)
   - Captures individual doctor details (name, department, inactive days, appointment count)
   - Usage: `CALL ArchiveInactiveDoctors();`

4. **`AssignDoctorToDepartment(IN doctor_id, IN department_id)`** - With parameters
   - Assigns doctor to different department with validation
   - Uses IF-ELSE control flow for validation
   - Logs department changes with detailed audit trail
   - Returns structured status and messages
   - Usage: `CALL AssignDoctorToDepartment(1, 2);`

#### ⚡ Triggers (3 Different Types)
1. **`trg_before_appointment_insert`** - BEFORE INSERT
   - Validates appointment dates
   - Auto-generates appointment numbers
   - Uses NEW parameter

2. **`trg_after_patient_update`** - AFTER UPDATE
   - Logs patient information changes
   - Uses both OLD and NEW parameters
   - Stores data in audit_log table

3. **`trg_before_doctor_delete`** - BEFORE DELETE
   - Prevents deletion of doctors with active appointments
   - Uses OLD parameter
   - Includes validation logic

#### 🚀 Indexes (3 Different Methods)
1. **Index during table creation**
   - Primary keys and foreign keys with automatic indexing
   - Composite indexes for performance optimization

2. **Using CREATE INDEX**
   - `idx_patient_name_email` on patients table
   - `idx_appointment_date_status` on appointments table
   - `idx_medical_record_patient_date` on medical_records table

3. **Using ALTER TABLE**
   - `idx_doctor_dept_status` on doctors table
   - Performance indexes for common queries

#### 👁️ Views (3 Types Including View within View)
1. **Horizontal View**: `patient_summary_view`
   - Aggregated patient data with appointment counts
   - Shows summary information across columns

2. **Vertical View**: `doctor_schedule_view`
   - Subset of doctor information for scheduling
   - Filtered columns for specific use cases

3. **View within View**: `appointment_details_view`
   - Uses both patient_summary_view and doctor_schedule_view
   - Complex nested view with JOIN operations
   - Includes WITH CHECK OPTION

#### 🔐 Database Security (Users, Roles, Privileges)
**Users Created:**
- `user1@localhost` - Limited access to patients table
- `user2@localhost` - Access to patient_summary_view only
- `user3@localhost` - Member of finance role

**Roles Created:**
- `finance` - Access to procedures and financial data
- `human_dev` - Access to doctor and department management
- `warehouse` - Access to treatments and specializations

**Privilege Examples:**
- SELECT, INSERT, UPDATE, DELETE on specific tables
- EXECUTE privileges on stored procedures
- Role-based access control implementation

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ (Latest LTS recommended)
- **MySQL Server** 8.0+ (with root access)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```sql
   # Connect to MySQL as root
   mysql -u root -p
   
   # Create database
   CREATE DATABASE hospital_management;
   
   # Create database user (optional but recommended)
   CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON hospital_management.* TO 'hospital_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your database credentials
   nano .env
   ```

5. **Database Migration and Seeding**
   ```bash
   # Run all migrations (creates tables, functions, procedures, etc.)
   npm run migrate
   
   # Populate database with sample data
   npm run seed
   
   # Or run both commands together
   npm run db:setup
   ```

6. **Start the Application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Access the Application**
   ```
   🌐 Web Interface: http://localhost:3000
   🔗 API Base URL: http://localhost:3000/api
   📊 Dashboard: http://localhost:3000/dashboard
   ```

### Verification
After installation, verify the setup:
- Check database tables: `SHOW TABLES;`
- Test functions: `SELECT GetCurrentPatientsCount();`
- Test procedures: `CALL GenerateHospitalStats();`
- Access login page: `http://localhost:3000/login`
  
## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory with the following configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=hospital_user
DB_PASSWORD=your_secure_password
DB_NAME=hospital_management

# Server Configuration
PORT=3000
NODE_ENV=development

# Security Configuration
JWT_SECRET=jwt_token
SESSION_SECRET=session_token
```

### Database Configuration
The application uses Knex.js for database operations. Configuration is defined in `knexfile.js`:

```javascript
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_management'
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  }
};
```

### Security Configuration
The application includes comprehensive security headers via Helmet.js:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All API endpoints require authentication except login/logout. Include session cookies or JWT tokens.

### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 100
  }
}
```

### Patient Endpoints
```http
GET    /api/patients              # Get all patients (paginated)
GET    /api/patients/search?q=term # Search patients by name/ID
GET    /api/patients/:id          # Get patient by ID
POST   /api/patients              # Create new patient
PUT    /api/patients/:id          # Update patient
DELETE /api/patients/:id          # Delete patient
```

**Patient Object Example:**
```json
{
  "id": 1,
  "patient_id": "PAT000001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "date_of_birth": "1985-05-15",
  "gender": "male",
  "address": "123 Main St, City, State",
  "blood_type": "A+",
  "allergies": "Penicillin",
  "status": "active"
}
```

### Doctor Endpoints
```http
GET    /api/doctors              # Get all doctors
GET    /api/doctors/:id          # Get doctor by ID
GET    /api/doctors/:id/specializations # Get doctor with specializations
POST   /api/doctors              # Create new doctor
PUT    /api/doctors/:id          # Update doctor
DELETE /api/doctors/:id          # Delete doctor
```

### Appointment Endpoints
```http
GET    /api/appointments         # Get all appointments (paginated)
GET    /api/appointments/today   # Get today's appointments
GET    /api/appointments/:id     # Get appointment by ID
POST   /api/appointments         # Create new appointment
PUT    /api/appointments/:id     # Update appointment
DELETE /api/appointments/:id     # Delete appointment
```

### Medical Records Endpoints
```http
GET    /api/medical-records      # Get all medical records (paginated)
GET    /api/medical-records/search?q=term # Search medical records
GET    /api/medical-records/:id  # Get medical record by ID
GET    /api/medical-records/patient/:patientId # Get records by patient
POST   /api/medical-records      # Create new medical record
PUT    /api/medical-records/:id  # Update medical record
DELETE /api/medical-records/:id  # Delete medical record
```

### Treatment Endpoints
```http
GET    /api/treatments           # Get all treatments
GET    /api/treatments/:id       # Get treatment by ID
POST   /api/treatments           # Create new treatment
PUT    /api/treatments/:id       # Update treatment
DELETE /api/treatments/:id       # Delete treatment
```

### Department Endpoints
```http
GET    /api/departments          # Get all departments
GET    /api/departments/:id      # Get department by ID
POST   /api/departments          # Create new department
PUT    /api/departments/:id      # Update department
DELETE /api/departments/:id      # Delete department
```

### User Management Endpoints (Admin Only)
```http
GET    /api/users                # Get all users
GET    /api/users/:id            # Get user by ID
POST   /api/users                # Create new user
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user
```

### Error Responses
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Email is required"
  }
}
```

## �️ Advanced Database Features

### Functions Testing
```sql
-- Test functions with no parameters
SELECT GetCurrentPatientsCount() as active_patients;
SELECT get_total_doctors() as total_doctors;

-- Test functions with parameters
SELECT CalculatePatientAge(1, CURDATE()) as patient_age;
SELECT get_doctors_by_department(1) as doctors_in_dept;

-- List all functions
SHOW FUNCTION STATUS WHERE Db = 'hospital_management';
```

### Stored Procedures Testing
```sql
-- Test procedures with no parameters (includes cursor and control flow)
CALL GenerateHospitalStats();
CALL ArchiveInactiveDoctors();

-- Test procedures with parameters (IN/OUT parameters with validation)
CALL BookAppointment(1, 1, '2024-12-01 10:00:00', @apt_id, @msg);
SELECT @apt_id as appointment_id, @msg as result_message;

CALL AssignDoctorToDepartment(1, 2);

-- List all procedures
SHOW PROCEDURE STATUS WHERE Db = 'hospital_management';

-- Check detailed logs from cursor-based procedure
SELECT * FROM doctor_status_log WHERE action_type = 'archived' ORDER BY created_at DESC;
SELECT * FROM doctor_status_log WHERE action_type = 'department_change' ORDER BY created_at DESC;
```

### Triggers Verification
```sql
-- Triggers fire automatically on these operations:

-- BEFORE INSERT trigger (appointment validation)
INSERT INTO appointments (patient_id, doctor_id, appointment_date) 
VALUES (1, 1, '2024-12-01 10:00:00');

-- AFTER UPDATE trigger (audit logging)
UPDATE patients SET email = 'newemail@example.com' WHERE id = 1;

-- View audit log
SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 5;

-- List all triggers
SHOW TRIGGERS;
```

### Indexes Performance Testing
```sql
-- Performance comparison with EXPLAIN
EXPLAIN SELECT * FROM patients WHERE last_name = 'Smith' AND first_name = 'John';
EXPLAIN SELECT * FROM appointments WHERE appointment_date >= CURDATE();

-- Show all indexes
SHOW INDEX FROM patients;
SHOW INDEX FROM appointments;
SHOW INDEX FROM medical_records;
```

### Views Testing
```sql
-- Test horizontal view (aggregated data)
SELECT * FROM patient_summary_view LIMIT 10;

-- Test vertical view (filtered columns)
SELECT * FROM doctor_schedule_view;

-- Test view within view (complex nested view)
SELECT * FROM appointment_details_view 
WHERE appointment_date >= CURDATE() 
LIMIT 5;

-- List all views
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

### Database Security Testing
```sql
-- Test user permissions (login as different users)
mysql -u user1 -p hospital_management
SELECT * FROM patients LIMIT 5; -- Should work

mysql -u user2 -p hospital_management  
SELECT * FROM patient_summary_view LIMIT 5; -- Should work
SELECT * FROM doctors; -- Should fail (no permission)

-- Test role permissions
mysql -u user3 -p hospital_management
CALL GenerateHospitalStats(); -- Should work (finance role)
```

## 📸 Screenshots


## 🛠️ Development & Deployment

### Development Commands
```bash
# Start development server with auto-reload
npm run dev

# Run database migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Seed database with sample data
npm run seed

# Complete database setup
npm run db:setup
```

### Testing Database Features
```bash
# Connect to MySQL and test features
mysql -u root -p hospital_management

# Test functions
SELECT GetCurrentPatientsCount();
SELECT CalculatePatientAge(1, CURDATE());

# Test procedures
CALL GenerateHospitalStats();
CALL BookAppointment(1, 1, '2024-12-01 10:00:00', @id, @msg);

# Check views
SELECT * FROM patient_summary_view LIMIT 5;
SELECT * FROM appointment_details_view LIMIT 5;
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production

# Install production dependencies only
npm ci --only=production

# Start production server
npm start

# Or use process manager
pm2 start src/app.js --name hospital-management
```


