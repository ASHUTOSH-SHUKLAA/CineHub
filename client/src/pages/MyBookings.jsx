import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';

const MyBookings = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/tickets/my-bookings');
            setBookings(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.patch(`/tickets/${bookingId}/cancel`);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-[180px] pb-8 min-h-screen">
                <div className="text-center text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-160">
            <h1 style={{marginLeft:"15px", marginTop:"80px"}}>My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center text-gray-400">
                    You haven't made any bookings yet.
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-lg shadow-md p-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {booking.movieTitle}
                                    </h2>
                                    <p className="text-gray-600">
                                        Show Time:{' '}
                                        {new Date(booking.showTime).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Seats: {booking.seatNumbers.join(', ')}
                                    </p>
                                    <p className="text-gray-600">
                                        Total Price: ₹{booking.totalPrice}
                                    </p>
                                    <p className="text-gray-600">
                                        Status:{' '}
                                        <span
                                            className={`font-semibold ${
                                                booking.status === 'confirmed'
                                                    ? 'text-green-500'
                                                    : booking.status === 'cancelled'
                                                    ? 'text-red-500'
                                                    : 'text-yellow-500'
                                            }`}
                                        >
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                {booking.status === 'confirmed' && (
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        onClick={() => handleCancelBooking(booking._id)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
