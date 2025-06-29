const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    // Connect to MySQL server without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'hospital_management'}\``);
    
    console.log('✅ Database created successfully!');
    console.log(`📁 Database name: ${process.env.DB_NAME || 'hospital_management'}`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    console.log('\n📝 Please ensure MySQL is running and accessible with the credentials in your .env file');
    console.log('💡 You can also manually create the database using: CREATE DATABASE hospital_management;');
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  createDatabase();
}

module.exports = createDatabase;
