# Hospital Management System

A full featured hospital management system for managing departments, doctors, patients, appointments, medical records, treatments, and users.

# Live Preview
https://hospital.typeof.me/

user: admin
pass: admin123

## Prerequisites
- Node.js (v16 or higher recommended)
- npm
- MySQL (or compatible database)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/typeofme/HospitalManagementSystem
cd HospitalManagementSystem
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure the Database
- Create a MySQL database.
- Update the database connection settings in `database/connection.js` as needed.

### 4. Run Database Migrations & Seeds
```sh
npx knex migrate:latest
npx knex seed:run
```
This will create all tables and populate initial data.


### 5. Environment Variables Setup

Copy `.env.example` to `.env` and update the values for your environment:

```sh
cp .env.example .env
```

Edit `.env` to match your database, server, and secret settings:

```
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### 6. Start the Application
```sh
npm run dev
```
The app will run on [http://localhost:3000](http://localhost:3000) by default.

## Usage
- Access the dashboard and modules via the browser.
- Manage departments, doctors, patients, appointments, treatments, and users.

## Project Structure
- `src/` - Main application code (controllers, models, routes)
- `database/` - SQL scripts, migrations, seeds
- `public/` - Static assets (CSS, JS)
- `views/` - EJS templates

## Troubleshooting
- Ensure MySQL is running and accessible.
- Check your database credentials in `database/connection.js` and `.env`.
- For migration errors, verify your database is empty or compatible.