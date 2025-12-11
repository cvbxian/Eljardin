const db = require('../db');

const addBooking = (data) => {
    const { customer_name, email, phone, booking_date, booking_time, guests } = data;
    return db.query(
        'INSERT INTO bookings (customer_name, email, phone, booking_date, booking_time, guests) VALUES (?, ?, ?, ?, ?, ?)',
        [customer_name, email, phone, booking_date, booking_time, guests]
    );
};

module.exports = { addBooking };
