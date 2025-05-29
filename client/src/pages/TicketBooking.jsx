import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const TicketBooking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showTime, setShowTime] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock data for available show times
    const showTimes = [
        '2024-03-20T10:00:00',
        '2024-03-20T13:00:00',
        '2024-03-20T16:00:00',
        '2024-03-20T19:00:00'
    ];

    // Mock data for seats (A1-A10, B1-B10, etc.)
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seats = rows.flatMap(row => 
        Array.from({ length: 10 }, (_, i) => `${row}${i + 1}`)
    );

    const handleSeatSelection = (seatNumber) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(seat => seat !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book tickets');
            navigate('/login');
            return;
        }

        if (!showTime) {
            toast.error('Please select a show time');
            return;
        }

        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }

        // Calculate total price based on seat type
        const getSeatPrice = (seatNumber) => {
            const row = seatNumber[0].toUpperCase();
            if (row === 'A' || row === 'B') return 800; // VIP
            if (['C', 'D', 'E'].includes(row)) return 500; // Premium
            return 300; // Standard
        };

        const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

        try {
            setLoading(true);
            await axios.post('/tickets', {
                movieId,
                movieTitle: 'Movie Title', // This should come from the movie details
                showTime,
                numberOfSeats: selectedSeats.length,
                seatNumbers: selectedSeats,
                totalPrice
            });

            toast.success('Tickets booked successfully!');
            navigate('/my-bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book tickets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Book Tickets</h1>
            
            {/* Show Time Selection */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Show Time</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {showTimes.map((time) => (
                        <button
                            key={time}
                            className={`p-4 border rounded-lg ${
                                showTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            }`}
                            onClick={() => setShowTime(time)}
                        >
                            {new Date(time).toLocaleTimeString()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seat Selection */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Seats</h2>
                <div className="grid grid-cols-10 gap-2">
                    {seats.map((seat) => (
                        <button
                            key={seat}
                            className={`p-2 border rounded ${
                                selectedSeats.includes(seat)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100'
                            }`}
                            onClick={() => handleSeatSelection(seat)}
                        >
                            {seat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Booking Summary */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
                    <p>Total Price: ₹{selectedSeats.reduce((sum, seat) => {
                        const row = seat[0].toUpperCase();
                        if (row === 'A' || row === 'B') return sum + 800;
                        if (['C', 'D', 'E'].includes(row)) return sum + 500;
                        return sum + 300;
                    }, 0)}</p>
                </div>
            </div>

            {/* Book Button */}
            <button
                className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
                onClick={handleBooking}
                disabled={loading || selectedSeats.length === 0 || !showTime}
            >
                {loading ? 'Booking...' : 'Book Tickets'}
            </button>
        </div>
    );
};

export default TicketBooking; 