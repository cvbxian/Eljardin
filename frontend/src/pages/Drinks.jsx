import React, { useState } from 'react';
import { Wine } from 'lucide-react';
import Toast from '../components/Toast';

export default function Drinks() {
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

    const drinks = [
        {
            id: 1,
            name: 'Iced Tea (Homemade)',
            description: 'Refreshing Filipino-style iced tea',
            price: 149,
            category: 'Beverage',
            image: '/src/images/drinks/iced-tea.jpg'
        },
        {
            id: 2,
            name: 'Fresh Calamansi Juice',
            description: 'Sour lime juice, a Filipino favorite',
            price: 249,
            category: 'Juice',
            image: '/src/images/drinks/calamansi.jpg'
        },
        {
            id: 3,
            name: 'Mango Juice',
            description: 'Fresh tropical mango juice',
            price: 299,
            category: 'Juice',
            image: '/src/images/drinks/mango.jpg'
        },
        {
            id: 4,
            name: 'Espresso',
            description: 'Strong black coffee',
            price: 199,
            category: 'Coffee',
            image: '/src/images/drinks/espresso.jpg'
        },
        {
            id: 5,
            name: 'Cappuccino',
            description: 'Espresso with steamed milk foam',
            price: 249,
            category: 'Coffee',
            image: '/src/images/drinks/cappuccino.jpg'
        },
        {
            id: 6,
            name: 'Iced Coffee',
            description: 'Cold brewed Filipino coffee',
            price: 224,
            category: 'Coffee',
            image: '/src/images/drinks/iced-coffee.jpg'
        },
        {
            id: 7,
            name: 'Buko Juice',
            description: 'Fresh coconut water drink',
            price: 274,
            category: 'Juice',
            image: '/src/images/drinks/buko.jpg'
        },
        {
            id: 8,
            name: 'Taho',
            description: 'Sweet silken tofu with syrup',
            price: 174,
            category: 'Dessert Drink',
            image: '/src/images/drinks/taho.jpg'
        }
    ];

    const addToCart = (item) => {
        setCart([...cart, item]);
        setToast(`${item.name} added to cart!`);
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold">Beverages</h1>
                    <p className="text-gray-600">Premium wines, coffees, and drinks</p>
                </div>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                    🛒 Cart ({cart.length})
                </button>
            </div>

            {showCart && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-purple-200">
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
                                            <p className="text-purple-600 font-bold">₱{item.price.toFixed(0)}</p>
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
                {drinks.map((drink) => (
                    <div key={drink.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img
                            src={drink.image}
                            alt={drink.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{drink.name}</h3>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                    {drink.category}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{drink.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-purple-600">₱{drink.price.toFixed(0)}</span>
                                <button
                                    onClick={() => addToCart(drink)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
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
