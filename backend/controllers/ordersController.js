const { promisePool } = require('../db');

const getOrders = async (req, res) => {
    try {
        console.log('📥 Fetching orders...');
        const [orders] = await promisePool.query(
            `SELECT o.id, o.user_id, o.items, o.order_date, o.total_amount, o.status, o.created_at, u.name, u.email, u.phone, u.address 
             FROM orders o 
             LEFT JOIN users u ON o.user_id = u.id 
             ORDER BY o.order_date DESC`
        );
        console.log(`✅ Found ${orders.length} orders`);
        res.json(orders);
    } catch (err) {
        console.error('❌ Error fetching orders:', err.message);
        console.error('SQL Error Code:', err.code);
        console.error('Error Stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
};

const addOrder = async (req, res) => {
    try {
        const { user_id, items, total, payment_method, delivery_address } = req.body;

        if (!user_id || !items || !total || !payment_method) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert order
        const itemsJson = JSON.stringify(items);
        const [result] = await promisePool.query(
            'INSERT INTO orders (user_id, items, total_amount, status) VALUES (?, ?, ?, "pending")',
            [user_id, itemsJson, total]
        );

        const orderId = result.insertId;
        console.log(`📦 Order created: ID=${orderId}, User=${user_id}, Total=${total}`);

        // Log order creation to order_log
        try {
            const logResult = await promisePool.query(
                'INSERT INTO order_log (user_id, order_id, action, details) VALUES (?, ?, ?, ?)',
                [user_id, orderId, 'order_created', `Payment method: ${payment_method}`]
            );
            console.log(`✅ Order logged in order_log: Order ${orderId}`, logResult[0]);
        } catch (logErr) {
            console.error(`❌ Failed to log order ${orderId}:`, logErr.message);
            console.error('SQL:', logErr.sql);
            console.error('Code:', logErr.code);
        }

        res.json({ message: 'Order placed', orderId, items, payment_method });
    } catch (err) {
        console.error(`❌ Error creating order:`, err.message);
        res.status(500).json({ error: err.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const [order] = await promisePool.query('SELECT user_id FROM orders WHERE id = ?', [orderId]);
        
        if (order.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        await promisePool.query(
            'UPDATE orders SET status = "cancelled" WHERE id = ?',
            [orderId]
        );

        // Log cancellation to order_log
        try {
            await promisePool.query(
                'INSERT INTO order_log (user_id, order_id, action, details) VALUES (?, ?, ?, ?)',
                [order[0].user_id, orderId, 'order_cancelled', `Reason: ${reason}`]
            );
            console.log(`📋 Order cancellation logged: Order ${orderId}`);
        } catch (logErr) {
            console.error(`⚠️ Failed to log cancellation for order ${orderId}:`, logErr.message);
        }

        res.json({ message: 'Order cancelled' });
    } catch (err) {
        console.error(`❌ Error cancelling order:`, err.message);
        res.status(500).json({ error: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { items, total } = req.body;

        const [order] = await promisePool.query('SELECT user_id FROM orders WHERE id = ?', [orderId]);
        
        if (order.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order items and total amount
        const itemsJson = JSON.stringify(items || []);
        await promisePool.query(
            'UPDATE orders SET items = ?, total_amount = ? WHERE id = ?',
            [itemsJson, total, orderId]
        );

        // Log item removal or update to order_log
        try {
            await promisePool.query(
                'INSERT INTO order_log (user_id, order_id, action, details) VALUES (?, ?, ?, ?)',
                [order[0].user_id, orderId, 'order_items_updated', `New total: ${total}`]
            );
            console.log(`📋 Order update logged: Order ${orderId}`);
        } catch (logErr) {
            console.error(`⚠️ Failed to log order update ${orderId}:`, logErr.message);
        }

        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getOrders, addOrder, cancelOrder, updateOrder };
