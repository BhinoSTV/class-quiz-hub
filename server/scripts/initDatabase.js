require('dotenv').config();
const database = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    await database.connect();
    console.log('✅ Database initialized successfully!');
    
    // Create a sample admin user (in production, this should be done securely)
    console.log('📝 Database is ready for use');
    console.log(`📊 Database location: ${process.env.DB_PATH}`);
    
    await database.close();
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();