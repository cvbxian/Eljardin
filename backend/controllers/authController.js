const { promisePool } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        console.log('📝 Signup attempt for:', { name, email, address });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔒 Password hashed');
        
        const [result] = await promisePool.query(
            'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, address || '']
        );

        const userId = result.insertId;
        console.log('✅ User inserted with ID:', userId);

        // Generate JWT token
        const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        console.log('🔑 Token generated');

        // Try to insert into user_log (non-fatal)
        try {
            await promisePool.query('INSERT INTO user_log (user_id, action) VALUES (?, ?)', [userId, 'signup']);
            console.log('📋 User log entry created for signup');
        } catch (err) {
            console.log('⚠️ user_log insert failed (signup):', err.message);
        }

        // Return token and user info so frontend can store them
        console.log('📤 Returning success response with token and user');
        res.json({ message: 'User registered', userId, token, user: { id: userId, name, email, address } });
    } catch (err) {
        console.error('❌ Signup error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);
        const [rows] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

        // Log login to user_log
        try {
            const logResult = await promisePool.query('INSERT INTO user_log (user_id, action) VALUES (?, ?)', [user.id, 'login']);
            console.log('✅ Login logged for user:', user.id, logResult[0]);
        } catch (err) {
            console.error('❌ Failed to log login for user:', user.id);
            console.error('SQL Error:', err.message);
            console.error('Code:', err.code);
        }

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signup, login };
