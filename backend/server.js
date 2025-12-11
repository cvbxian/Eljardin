const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const logsRoutes = require('./routes/logs');

const app = express();

// CORS Middleware - MUST HAVE FOR FRONTEND
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend connected successfully!',
    database: 'MySQL',
    db_name: process.env.DB_NAME,
    status: 'active'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: 'MySQL',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
  try {
    console.log('🔄 Attempting to connect to database...');
    
    // Connect to database first
    const isConnected = await connectDB();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Server will not start.');
      process.exit(1);
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n=======================================`);
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Frontend: http://localhost:5173`);
      console.log(`✅ Backend API: http://localhost:${PORT}`);
      console.log(`✅ Database: MySQL (${process.env.DB_NAME})`);
      console.log(`✅ Test API: http://localhost:${PORT}/api/test`);
      console.log(`=======================================\n`);
    });
    
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();