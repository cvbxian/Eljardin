import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CreditCard, DollarSign, X, Eye } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showUserOrders, setShowUserOrders] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    useEffect(() => {
        const init = async () => {
            // Load current user
            const userStr = localStorage.getItem('user');
            let user = null;
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                    setCurrentUser(user);
                } catch (err) {
                    console.error('Error parsing user:', err);
                }
            }

            // Fetch orders and populate userOrders immediately if user exists
            const latest = await fetchOrders();
            if (user?.id) {
                const filtered = (latest || []).filter(o => Number(o.user_id) === Number(user.id));
                setUserOrders(filtered);
                // Show user orders automatically on page load if there are orders
                if (filtered.length > 0) {
                    setShowUserOrders(true);
                }
            }

            // Load cart from sessionStorage
            const cartStr = sessionStorage.getItem('cart');
            if (cartStr) {
                try {
                    setCartItems(JSON.parse(cartStr));
                } catch (err) {
                    console.error('Error loading cart:', err);
                }
            }
        };

        init();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders');
            if (response.ok) {
                const data = await response.json();
                // Transform database orders to match display format
                const formattedOrders = data.map(order => ({
                    id: order.id,
                    orderDate: new Date(order.order_date).toLocaleString(),
                    items: (typeof order.items === 'string' && order.items) ? JSON.parse(order.items) : (order.items || []),
                    subtotal: order.total_amount || 0,
                    total: order.total_amount || 0,
                    user: {
                        name: order.name || 'Guest',
                        email: order.email || 'N/A',
                        phone: order.phone || 'N/A',
                        address: order.address || 'Not provided'
                    },
                    paymentMethod: 'COD',
                    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                    notes: `Payment via COD`,
                    user_id: Number(order.user_id)
                }));
                setOrders(formattedOrders);
                
                // Return formatted orders so callers can use them immediately
                return formattedOrders;
            } else {
                const errorData = await response.json();
                console.error('❌ Server error:', response.status, errorData);
                alert(`Error fetching orders: ${errorData.error || response.statusText}`);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            alert(`Failed to fetch orders: ${err.message}`);
        }
        return [];
    };

    const updateUserOrders = () => {
        if (currentUser?.id) {
            const filtered = orders.filter(order => Number(order.user_id) === Number(currentUser.id));
            setUserOrders(filtered);
        }
    };

    const removeFromCart = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const openRemoveItemModal = (orderId, itemIndex) => {
        setSelectedOrderId(orderId);
        setSelectedItemIndex(itemIndex);
        setShowRemoveItemModal(true);
    };

    const removeItemFromOrder = async () => {
        try {
            const order = orders.find(o => o.id === selectedOrderId);
            if (!order) return;

            const itemToRemove = order.items[selectedItemIndex];
            const updatedItems = order.items.filter((_, i) => i !== selectedItemIndex);
            const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);

            // Update order in database with new total
            const response = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: updatedItems,
                    total: newTotal
                })
            });

            if (response.ok) {
                // Update local state
                const updatedOrders = orders.map(o =>
                    o.id === selectedOrderId
                        ? { ...o, items: updatedItems, total: newTotal, subtotal: newTotal }
                        : o
                );
                setOrders(updatedOrders);
                updateUserOrders();
                setShowRemoveItemModal(false);
                alert(`${itemToRemove.name} removed from order`);
            } else {
                alert('Error removing item from order');
            }
        } catch (err) {
            console.error('Error removing item:', err);
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            // Save order to database
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser?.id || 1,
                    items: cartItems,
                    total: cartItems.reduce((sum, item) => sum + item.price, 0),
                    payment_method: paymentMethod,
                    delivery_address: currentUser?.address || 'Not provided'
                })
            });

            if (response.ok) {
                const result = await response.json();
                
                // Clear cart
                setCartItems([]);
                sessionStorage.removeItem('cart');
                setShowCheckout(false);
                setPaymentMethod('');

                // Refresh orders from database and update user-specific view
                const latest = await fetchOrders();
                if (currentUser?.id) {
                    const filtered = (latest || []).filter(o => Number(o.user_id) === Number(currentUser.id));
                    setUserOrders(filtered);
                }

                alert(`Order #${result.orderId} placed successfully! Payment method: ${paymentMethod}`);
            } else {
                alert('Error placing order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order');
        }
    };

    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a cancellation reason');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/cancel`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (response.ok) {
                const updatedOrders = orders.map(o =>
                    o.id === selectedOrderId
                        ? { ...o, status: 'Cancelled', cancellation_reason: cancelReason, cancelled_at: new Date().toLocaleString() }
                        : o
                );

                setOrders(updatedOrders);
                setShowCancelModal(false);
                
                // Refresh orders from database and update user-specific view
                const latest = await fetchOrders();
                if (currentUser?.id) {
                    const filtered = (latest || []).filter(o => Number(o.user_id) === Number(currentUser.id));
                    setUserOrders(filtered);
                }

                alert('Order cancelled successfully');
            } else {
                alert('Error cancelling order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Failed to cancel order');
        }
    };

    const clearAllOrders = () => {
        if (window.confirm('Are you sure you want to clear all orders?')) {
            setOrders([]);
            localStorage.removeItem('orders');
        }
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(0);

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">Orders</h1>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Cancel Order</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">Please tell us why you're cancelling this order:</p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-4"
                            rows="4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Item Modal */}
            {showRemoveItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Remove Item</h3>
                            <button
                                onClick={() => setShowRemoveItemModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">Are you sure you want to remove this item from the order?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRemoveItemModal(false)}
                                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Keep Item
                            </button>
                            <button
                                onClick={removeItemFromOrder}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Remove Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shopping Cart Section */}
            {cartItems.length > 0 && (
                <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6" />
                            Shopping Cart ({cartItems.length} items)
                        </h2>
                        <button
                            onClick={() => {
                                setCartItems([]);
                                sessionStorage.removeItem('cart');
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                        >
                            Clear Cart
                        </button>
                    </div>

                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-3">
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-amber-600">₱{item.price.toFixed(0)}</span>
                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t-2 pt-4 mb-6">
                        <p className="text-xl font-bold mb-4">Total: ₱{cartTotal}</p>
                    </div>

                    {!showCheckout ? (
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-bold text-lg"
                        >
                            Proceed to Checkout
                        </button>
                    ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
                            
                            <div className="space-y-3 mb-6">
                                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-100" style={{borderColor: paymentMethod === 'COD' ? '#d97706' : '#ccc'}}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-3 font-semibold">
                                        💵 Cash on Delivery (COD)
                                    </span>
                                    <span className="ml-auto text-sm text-gray-600">Pay when received</span>
                                </label>

                                <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-100" style={{borderColor: paymentMethod === 'GCash' ? '#d97706' : '#ccc'}}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="GCash"
                                        checked={paymentMethod === 'GCash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-3 font-semibold">
                                        📱 GCash Payment
                                    </span>
                                    <span className="ml-auto text-sm text-gray-600">Digital payment</span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCheckout(false);
                                        setPaymentMethod('');
                                    }}
                                    className="flex-1 bg-gray-400 text-white px-4 py-3 rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-bold"
                                >
                                    Complete Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* User Info Display */}
            {currentUser && (
                <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold mb-3">📦 Delivery Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-semibold">{currentUser.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold">{currentUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-semibold">{currentUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="font-semibold">{currentUser.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                // Ensure we have the latest orders from server then filter for current user
                                const data = await fetchOrders();
                                if (currentUser?.id) {
                                    const filtered = (data || []).filter(o => Number(o.user_id) === Number(currentUser.id));
                                    setUserOrders(filtered);
                                }
                                setShowUserOrders(prev => !prev);
                            }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                        >
                            <Eye className="w-5 h-5" />
                            My Orders
                        </button>
                    </div>
                </div>
            )}

            {/* My Orders Section */}
            {showUserOrders && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                    {userOrders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No orders found.</p>
                    ) : (
                    <div className="space-y-6">
                        {userOrders.map((order) => (
                            <div key={order.id} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${order.status === 'Cancelled' ? 'border-red-600 opacity-75' : 'border-green-600'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order #</p>
                                        <p className="font-bold text-lg">{order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">{order.orderDate}</p>
                                        <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4 pb-4 border-b">
                                    <h4 className="font-semibold mb-3">Items Ordered:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-semibold">{item.name}</p>
                                                    <p className="text-xs text-gray-500">₱{item.price.toFixed(0)}</p>
                                                </div>
                                                {order.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={() => openRemoveItemModal(order.id, idx)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-600">Delivery Address</p>
                                        <p className="text-sm font-semibold">{order.user?.address || 'Not provided'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold text-amber-600">₱{typeof order.total === 'number' ? order.total.toFixed(0) : order.total || '0'}</p>
                                    </div>
                                </div>

                                {order.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => openCancelModal(order.id)}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            )}

            {/* Orders History */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Order History</h2>
                    {orders.length > 0 && (
                        <button
                            onClick={clearAllOrders}
                            className="text-red-600 hover:text-red-800 text-sm"
                        >
                            Clear History
                        </button>
                    )}
                </div>

                {/* Filter orders to show only current user's orders */}
                {(() => {
                    const userFilteredOrders = currentUser ? orders.filter(o => Number(o.user_id) === Number(currentUser.id)) : [];
                    return userFilteredOrders.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No orders yet. Start shopping!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {userFilteredOrders.map((order) => (
                            <div key={order.id} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${order.status === 'Cancelled' ? 'border-red-600 opacity-75' : 'border-amber-600'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order #</p>
                                        <p className="font-bold text-lg">{order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">{order.orderDate}</p>
                                        <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {order.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4 pb-4 border-b">
                                    <h4 className="font-semibold mb-2">Items Ordered:</h4>
                                    <ul className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="text-sm text-gray-700">
                                                • {item.name} - ₱{item.price.toFixed(0)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-600">Delivery To:</p>
                                        <p className="font-semibold">{order.user.name}</p>
                                        <p className="text-sm text-gray-700">{order.user.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact:</p>
                                        <p className="font-semibold">{order.user.phone}</p>
                                        <p className="text-sm text-gray-700">{order.user.email}</p>
                                    </div>
                                </div>

                                {order.status === 'Cancelled' && (
                                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                                        <p className="text-sm font-semibold text-red-800">Cancellation Reason:</p>
                                        <p className="text-sm text-red-700">{order.cancellation_reason}</p>
                                        <p className="text-xs text-gray-600 mt-2">Cancelled on: {order.cancelled_at}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-bold text-amber-600">{order.paymentMethod}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-bold text-2xl text-green-600">₱{order.total && typeof order.total === 'number' ? order.total.toFixed(0) : order.total || '0'}</p>
                                    </div>
                                </div>

                                {order.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => openCancelModal(order.id)}
                                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    );
                })()}
            </div>
        </div>
    );
}
