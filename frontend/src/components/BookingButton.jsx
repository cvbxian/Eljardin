// frontend/src/components/BookingButton.jsx
import React from 'react'

export default function BookingButton({ bookingData }) {
  const handleBooking = () => {
    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
      .then(res => res.json())
      .then(response => {
        console.log('Booking response:', response)
        alert('Booking successful!')
      })
      .catch(err => {
        console.error(err)
        alert('Booking failed!')
      })
  }

  return (
    <button 
      onClick={handleBooking} 
      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
    >
      Book Table
    </button>
  )
}
