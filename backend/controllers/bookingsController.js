const { promisePool } = require('../db');

const getBookings = async (req, res) => {
    try {
        const [bookings] = await promisePool.query('SELECT * FROM bookings ORDER BY booking_date DESC');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addBooking = async (req, res) => {
    try {
        const { user_id, booking_date, booking_time, table_number, number_of_guests } = req.body;
        
        if (!user_id || !booking_date || !booking_time || !table_number || !number_of_guests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const [result] = await promisePool.query(
            'INSERT INTO bookings (user_id, booking_date, number_of_guests, special_requests, status) VALUES (?, CONCAT(?, " ", ?), ?, ?, "pending")',
            [user_id, booking_date, booking_time, number_of_guests, `Table ${table_number}`]
        );
        
        const bookingId = result.insertId;
        
        // Log booking to booking_log table
        await promisePool.query(
            'INSERT INTO booking_log (user_id, booking_id, action, booking_date, number_of_guests, status) VALUES (?, ?, ?, CONCAT(?, " ", ?), ?, "created")',
            [user_id, bookingId, 'booking_created', booking_date, booking_time, number_of_guests]
        );
        
        res.json({ message: 'Booking added', bookingId: bookingId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;

        const [result] = await promisePool.query(
            'UPDATE bookings SET status = "cancelled", special_requests = ? WHERE id = ?',
            [reason, bookingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getBookings, addBooking, cancelBooking };
