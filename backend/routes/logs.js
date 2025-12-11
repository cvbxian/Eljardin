const express = require('express');
const router = express.Router();
const { getBookingLogs, getOrderLogs, getUserLogs } = require('../controllers/logsController');

router.get('/booking', getBookingLogs);
router.get('/order', getOrderLogs);
router.get('/user', getUserLogs);

module.exports = router;
