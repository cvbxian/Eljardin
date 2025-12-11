import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Guests() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            } catch (err) {
                console.error('Error parsing user:', err);
            }
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Guest Profile</h1>
                <p className="text-gray-600">You are not logged in. Please login first.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">Guest Profile</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-700">Full Name</span>
                        </div>
                        <p className="text-lg text-gray-900 ml-8">{currentUser.name}</p>
                    </div>

                    {/* Email */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-700">Email</span>
                        </div>
                        <p className="text-lg text-gray-900 ml-8">{currentUser.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-700">Phone</span>
                        </div>
                        <p className="text-lg text-gray-900 ml-8">{currentUser.phone || 'Not provided'}</p>
                    </div>

                    {/* Address */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-700">Address</span>
                        </div>
                        <p className="text-lg text-gray-900 ml-8">{currentUser.address || 'Not provided'}</p>
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to El Jardin!</h3>
                <p className="text-blue-800">
                    This is your guest profile. Your information will be used for order delivery and communication.
                    You can view your orders in the Orders page.
                </p>
            </div>
        </div>
    );
}
