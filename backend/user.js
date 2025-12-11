const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔐 Creating test user...');
console.log('📁 Database:', process.env.DB_NAME);
console.log('🏠 Host:', process.env.DB_HOST);

// Create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'el_jardin_ordering'
});

async function createTestUser() {
  return new Promise((resolve, reject) => {
    connection.connect(async (err) => {
      if (err) {
        console.error('❌ Connection error:', err.message);
        console.log('\nTroubleshooting:');
        console.log('1. Is MariaDB running?');
        console.log('2. Check: mysql -u root');
        console.log('3. Check .env file values');
        reject(err);
        return;
      }

      console.log('✅ Connected to MariaDB');

      try {
        // First, make sure users table exists
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin', 'chef', 'staff') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `;

        connection.query(createTableSQL, (err) => {
          if (err) {
            console.error('❌ Error creating table:', err.message);
            reject(err);
            return;
          }

          console.log('✅ Users table verified');

          // Hash password for "password123"
          bcrypt.hash('password123', 10, (err, hashedPassword) => {
            if (err) {
              console.error('❌ Error hashing password:', err.message);
              reject(err);
              return;
            }

            // Insert test user
            const insertSQL = `
              INSERT INTO users (name, email, password, role) 
              VALUES (?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE name = VALUES(name)
            `;
            
            const values = ['Test User', 'test@example.com', hashedPassword, 'admin'];
            
            connection.query(insertSQL, values, (err, result) => {
              if (err) {
                console.error('❌ Error creating user:', err.message);
                reject(err);
              } else {
                if (result.affectedRows > 0) {
                  console.log('\n🎉 Test user created successfully!');
                  console.log('════════════════════════════════════');
                  console.log('📧 Email: test@example.com');
                  console.log('🔑 Password: password123');
                  console.log('👑 Role: admin');
                  console.log('════════════════════════════════════\n');
                  
                  // Show all users
                  connection.query('SELECT id, name, email, role, created_at FROM users', (err, users) => {
                    if (err) {
                      console.error('❌ Error fetching users:', err.message);
                    } else {
                      console.log('📊 Current users in database:');
                      console.table(users);
                    }
                    resolve();
                    connection.end();
                  });
                } else {
                  console.log('⚠️ Test user already exists');
                  
                  // Show existing users
                  connection.query('SELECT id, name, email, role FROM users', (err, users) => {
                    if (err) {
                      console.error('❌ Error fetching users:', err.message);
                    } else {
                      console.log('\n📊 Existing users:');
                      console.table(users);
                    }
                    resolve();
                    connection.end();
                  });
                }
              }
            });
          });
        });
      } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        reject(error);
        connection.end();
      }
    });
  });
}

// Run the function
createTestUser()
  .then(() => {
    console.log('✅ Script completed');
  })
  .catch((error) => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });