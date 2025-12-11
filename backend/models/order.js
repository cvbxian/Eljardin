const db = require('../db');

const addOrder = (data) => {
    const { customer_name, items, total } = data;
    return db.query(
        'INSERT INTO orders (customer_name, items, total) VALUES (?, ?, ?)',
        [customer_name, JSON.stringify(items), total]
    );
};

module.exports = { addOrder };
