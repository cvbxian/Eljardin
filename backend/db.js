const mysql = require('mysql2');
require('dotenv').config();

console.log('=== DATABASE CONFIGURATION CHECK ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'empty');
console.log('Environment loaded:', process.env.NODE_ENV || 'development');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add event listeners for debugging
pool.on('connection', (connection) => {
  console.log('✅ New MySQL connection established, threadId:', connection.threadId);
});

pool.on('acquire', (connection) => {
  console.log('🔗 Connection acquired, threadId:', connection.threadId);
});

pool.on('release', (connection) => {
  console.log('🔄 Connection released, threadId:', connection.threadId);
});

pool.on('error', (err) => {
  console.error('❌ MySQL pool error:', err.message);
  console.error('Error code:', err.code);
});

// Create a promise wrapper for async/await
const promisePool = pool.promise();

// Test database connection
const connectDB = async () => {
  console.log('=== ATTEMPTING DATABASE CONNECTION ===');
  try {
    console.log('Getting connection from pool...');
    const connection = await promisePool.getConnection();
    console.log(`✅ MySQL Connected to database: ${process.env.DB_NAME}`);
    console.log('Connection threadId:', connection.threadId);
    
    // Test query
    console.log('Running test query...');
    const [result] = await connection.query('SELECT DATABASE() as db, USER() as user');
    console.log('Connected to database:', result[0].db);
    console.log('Connected as user:', result[0].user);
    
    connection.release();
    console.log('Connection released');
    
    // Create tables if they don't exist
    await createTables();
    return true;
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    return false;
  }
};

// Create tables function (keep as is)
const createTables = async () => {
  try {
    const connection = await promisePool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address VARCHAR(255),
        role ENUM('user', 'admin', 'chef', 'staff') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');
    
    // Add phone column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT ''
      `);
      console.log('✅ Phone column added to users table');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️  Phone column already exists');
      } else {
        throw error;
      }
    }
    
    // Add address column if it doesn't exist
    try {
      await connection.query(`
        ALTER TABLE users ADD COLUMN address VARCHAR(255) DEFAULT ''
      `);
      console.log('✅ Address column added to users table');
    } catch (error) {
      if (error.message.includes('Duplicate column')) {
        console.log('ℹ️  Address column already exists');
      } else {
        throw error;
      }
    }
    
    // Create bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_date DATETIME NOT NULL,
        number_of_guests INT NOT NULL,
        special_requests TEXT,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Bookings table created/verified');
    
    // Create booking_log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS booking_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        booking_id INT,
        action VARCHAR(100) NOT NULL,
        booking_date DATETIME,
        number_of_guests INT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);
    console.log('✅ Booking log table created/verified');
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        items JSON DEFAULT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Orders table created/verified');

    // Ensure orders table has an items column for storing order items as JSON
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN items JSON NULL`);
      console.log('✅ Added items column to orders table');
    } catch (err) {
      if (err.message && err.message.includes('Duplicate column')) {
        console.log('ℹ️  Orders.items column already exists');
      } else {
        // ignore other errors silently to avoid crashing createTables
      }
    }
    
    // Create user_log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✅ User log table created/verified');
    
    // Create order_log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_id INT NOT NULL,
        action VARCHAR(100) NOT NULL,
        details VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);
    console.log('✅ Order log table created/verified');
    
    connection.release();
    console.log('✅ All tables verified/created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

module.exports = { connectDB, promisePool };