import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, MapPin, Trash2, X } from 'lucide-react';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        booking_date: '',
        booking_time: '',
        table_number: '',
        number_of_guests: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    useEffect(() => {
        // Get current user
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                // Fetch bookings after setting current user
                fetchBookings(user);
            } catch (err) {
                console.error('Error parsing user:', err);
                // If no user logged in, still fetch but won't filter
                fetchBookings(null);
            }
        } else {
            fetchBookings(null);
        }
    }, []);

    const fetchBookings = async (user) => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings');
            if (response.ok) {
                const data = await response.json();
                // Filter bookings to show only current user's bookings
                const userBookings = user ? data.filter(booking => Number(booking.user_id) === Number(user.id)) : [];
                setBookings(userBookings);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        if (!formData.booking_date || !formData.booking_time || !formData.table_number || !formData.number_of_guests) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser?.id || 1,
                    booking_date: formData.booking_date,
                    booking_time: formData.booking_time,
                    table_number: parseInt(formData.table_number),
                    number_of_guests: parseInt(formData.number_of_guests)
                })
            });

            if (response.ok) {
                alert('Booking created successfully!');
                setFormData({ booking_date: '', booking_time: '', table_number: '', number_of_guests: '' });
                setShowForm(false);
                fetchBookings(); // Refresh bookings list
            } else {
                alert('Error creating booking');
            }
        } catch (err) {
            console.error('Error submitting booking:', err);
            alert('Failed to create booking');
        }
    };

    const openCancelModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a cancellation reason');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${selectedBookingId}/cancel`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (response.ok) {
                setShowCancelModal(false);
                alert('Booking cancelled successfully');
                fetchBookings(); // Refresh bookings list
            } else {
                alert('Error cancelling booking');
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">Table Bookings</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 font-bold"
                >
                    {showForm ? 'Hide Form' : 'New Booking'}
                </button>
            </div>

            {/* Booking Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-amber-200">
                    <h2 className="text-2xl font-bold mb-4">Create a Booking</h2>
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Booking Date
                                </label>
                                <input
                                    type="date"
                                    name="booking_date"
                                    value={formData.booking_date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    name="booking_time"
                                    value={formData.booking_time}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Table Number
                                </label>
                                <input
                                    type="number"
                                    name="table_number"
                                    min="1"
                                    max="20"
                                    value={formData.table_number}
                                    onChange={handleInputChange}
                                    placeholder="1-20"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    name="number_of_guests"
                                    min="1"
                                    max="10"
                                    value={formData.number_of_guests}
                                    onChange={handleInputChange}
                                    placeholder="1-10"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-bold"
                        >
                            Confirm Booking
                        </button>
                    </form>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Cancel Booking</h3>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">Please tell us why you're cancelling this booking:</p>
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
                                Keep Booking
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bookings List */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
                {bookings.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-600 text-lg">No bookings yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${booking.status === 'cancelled' ? 'border-red-600 opacity-75' : 'border-amber-600'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Booking ID</p>
                                        <p className="font-bold text-lg">{booking.id}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Date & Time</p>
                                        <p className="font-semibold">{new Date(booking.booking_date).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Guests</p>
                                        <p className="font-semibold">{booking.number_of_guests} person(s)</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Table Info</p>
                                        <p className="font-semibold">{booking.special_requests}</p>
                                    </div>
                                </div>

                                {booking.status === 'cancelled' && (
                                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                                        <p className="text-sm font-semibold text-red-800">Cancellation Reason:</p>
                                        <p className="text-sm text-red-700">{booking.special_requests}</p>
                                    </div>
                                )}

                                {booking.status !== 'cancelled' && (
                                    <button
                                        onClick={() => openCancelModal(booking.id)}
                                        className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
