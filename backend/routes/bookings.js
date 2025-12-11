const express = require('express');
const router = express.Router();
const { getBookings, addBooking, cancelBooking } = require('../controllers/bookingsController');

router.get('/', getBookings);
router.post('/', addBooking);
router.patch('/:bookingId/cancel', cancelBooking);

module.exports = router;
