import React, { useState } from 'react';
import { Cake } from 'lucide-react';
import Toast from '../components/Toast';

export default function Cafe() {
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

    const cafeItems = [
        {
            id: 1,
            price: 399,
            category: 'Dessert',
            name: 'Halo-Halo',
            description: 'Refreshing Filipino shaved ice with sweet toppings and condensed milk',
            image: '/src/images/cafe/halo-halo.jpg'
        },
        {
            id: 2,
            price: 349,
            category: 'Dessert',
            name: 'Leche Flan',
            description: 'Silky smooth Filipino caramel custard dessert',
            image: '/src/images/cafe/leche-flan.jpg'
        },
        {
            id: 3,
            price: 449,
            category: 'Dessert',
            name: 'Ube Cake',
            description: 'Purple yam Filipino cake with creamy frosting',
            image: '/src/images/cafe/ube-cake.jpg'
        },
        {
            id: 4,
            price: 299,
            category: 'Gelato',
            name: 'Bibingka',
            description: 'Filipino rice cake with cheese and salted egg',
            image: '/src/images/cafe/bibingka.jpg'
        },
        {
            id: 5,
            price: 349,
            category: 'Pastry',
            name: 'Turon',
            description: 'Crispy Filipino banana-calamansi spring rolls with caramel',
            image: '/src/images/cafe/turon.jpg'
        },
        {
            id: 6,
            price: 274,
            category: 'Pastry',
            name: 'Ensaymada',
            description: 'Filipino spiral pastry with cheese and brown sugar',
            image: '/src/images/cafe/ensaymada.jpg'
        },
        {
            id: 7,
            price: 499,
            category: 'Pastry',
            name: 'Lumpia with Chocolate',
            description: 'Crispy Filipino spring rolls filled with chocolate and banana',
            image: '/src/images/cafe/lumpia-chocolate.jpg'
        },
        {
            id: 8,
            price: 249,
            category: 'Pastry',
            name: 'Macarons',
            description: 'Filipino-style colorful almond macarons with local flavors',
            image: '/src/images/cafe/macarons.jpg'
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
                    <h1 className="text-4xl font-bold">Cafe & Desserts</h1>
                    <p className="text-gray-600">Delicious Filipino desserts and sweet treats</p>
                </div>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
                >
                    🛒 Cart ({cart.length})
                </button>
            </div>

            {showCart && (
                <div className="mb-6 bg-white p-4 rounded-lg border border-pink-200">
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
                                            <p className="text-pink-600 font-bold">₱{item.price.toFixed(0)}</p>
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
                {cafeItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{item.name}</h3>
                                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                                    {item.category}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-pink-600">₱{item.price.toFixed(0)}</span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
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
