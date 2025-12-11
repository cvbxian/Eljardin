const { promisePool } = require('../db');

const getBookingLogs = async (req, res) => {
    try {
        const [logs] = await promisePool.query(
            `SELECT bl.*, u.name, u.email 
             FROM booking_log bl 
             LEFT JOIN users u ON bl.user_id = u.id 
             ORDER BY bl.created_at DESC`
        );
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrderLogs = async (req, res) => {
    try {
        const [logs] = await promisePool.query(
            `SELECT ol.*, u.name, u.email 
             FROM order_log ol 
             LEFT JOIN users u ON ol.user_id = u.id 
             ORDER BY ol.created_at DESC`
        );
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserLogs = async (req, res) => {
    try {
        const [logs] = await promisePool.query(
            `SELECT ul.*, u.name, u.email 
             FROM user_log ul 
             LEFT JOIN users u ON ul.user_id = u.id 
             ORDER BY ul.created_at DESC`
        );
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getBookingLogs, getOrderLogs, getUserLogs };
