import { apiRequest } from './api';

// Bookings API calls

// Get all bookings - GET /api/bookings
export const getBookings = async () => {
  return apiRequest('/bookings');
};

// Get booking by ID - GET /api/bookings/:id
export const getBookingById = async (id) => {
  return apiRequest(`/bookings/${id}`);
};

// Create new booking - POST /api/bookings
export const createBooking = async (bookingData) => {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });
};

// Update booking - PUT /api/bookings/:id
export const updateBooking = async (id, bookingData) => {
  return apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookingData),
  });
};

// Delete booking - DELETE /api/bookings/:id
export const deleteBooking = async (id) => {
  return apiRequest(`/bookings/${id}`, {
    method: 'DELETE',
  });
};

// Get bookings by date - GET /api/bookings/date/:date
export const getBookingsByDate = async (date) => {
  return apiRequest(`/bookings/date/${date}`);
};