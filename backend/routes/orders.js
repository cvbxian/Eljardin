const express = require('express');
const router = express.Router();
const { getOrders, addOrder, cancelOrder, updateOrder } = require('../controllers/ordersController');

router.get('/', getOrders);
router.post('/', addOrder);
router.patch('/:orderId/cancel', cancelOrder);
router.patch('/:orderId', updateOrder);

module.exports = router;
