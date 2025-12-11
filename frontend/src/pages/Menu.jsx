import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Toast from '../components/Toast';

export default function Menu() {
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [toast, setToast] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    React.useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setCurrentUser(JSON.parse(userStr));
            } catch (err) {
                console.error('Error parsing user:', err);
            }
        }
    }, []);

    const menuItems = [
        {
            id: 1,
            name: 'Chicken Adobo',
            description: 'Chicken braised in vinegar, soy sauce, and garlic',
            price: 649,
            image: '/src/images/menu/adobo.jpg'
        },
        {
            id: 2,
            name: 'Sinigang',
            description: 'Pork and vegetable stew in tamarind broth',
            price: 699,
            image: '/src/images/menu/sinigang.jpg'
        },
        {
            id: 3,
            name: 'Kare-Kare',
            description: 'Oxtail and vegetables in peanut sauce',
            price: 749,
            image: '/src/images/menu/kare-kare.jpg'
        },
        {
            id: 4,
            name: 'Lumpia',
            description: 'Crispy spring rolls with meat and vegetables',
            price: 449,
            image: '/src/images/menu/lumpia.jpg'
        },
        {
            id: 5,
            name: 'Tinola',
            description: 'Ginger-based chicken soup with green papaya',
            price: 599,
            image: '/src/images/menu/tinola.jpg'
        },
        {
            id: 6,
            name: 'Lechon Kawali',
            description: 'Crispy fried pork belly with liver sauce',
            price: 849,
            image: '/src/images/menu/lechon-kawali.jpg'
        },
        {
            id: 7,
            name: 'Pinakbet',
            description: 'Mixed vegetables with anchovy paste',
            price: 549,
            image: '/src/images/menu/pinakbet.jpg'
        },
        {
            id: 8,
            name: 'Bisque',
            description: 'Creamy oxtail soup with vegetables',
            price: 499,
            image: '/src/images/menu/bisque.jpg'
        }
    ];

    const addToCart = (item) => {
        setCart([...cart, item]);
        setToast(`${item.name} added to cart!`);
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setToast('Your cart is empty!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser?.id || 1,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + item.price, 0),
                    payment_method: 'COD',
                    delivery_address: currentUser?.address || 'Not provided'
                })
            });

            if (response.ok) {
                const result = await response.json();
                setToast(`Order #${result.orderId} placed successfully!`);
                setCart([]);
                setShowCart(false);
            } else {
                setToast('Error placing order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setToast('Failed to place order');
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Menu</h1>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({cart.length})
                </button>
            </div>

            {showCart && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-amber-200">
                    <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty</p>
                    ) : (
                        <>
                            <div className="space-y-2 mb-4">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-amber-600 font-bold">₱{item.price.toFixed(0)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(index)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t-2 pt-4">
                                <p className="text-xl font-bold">Total: ₱{totalPrice}</p>
                                <button
                                    onClick={handleCheckout}
                                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold"
                                >
                                    Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-amber-600">₱{item.price.toFixed(0)}</span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
