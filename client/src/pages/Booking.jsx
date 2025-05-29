import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from '@mui/material';
import axios from "axios";

import { tmdbApi } from '../api';
import ticketApi from '../api/modules/ticket.api';
import SeatSelection from '../components/booking/SeatSelection';
import BookingSummary from '../components/booking/BookingSummary';
import { toast } from 'react-toastify';

const Booking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showtime, setShowtime] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const response = await tmdbApi.getMovieDetails(movieId);
                setMovie(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movie:', error);
                setLoading(false);
            }
        };

        getMovie();
    }, [movieId]);

    useEffect(() => {
        if (showtime) {
            fetchAvailableSeats();
            // Set up polling for real-time updates
            const interval = setInterval(fetchAvailableSeats, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [showtime]);

    const fetchAvailableSeats = async () => {
        try {
            const { response, err } = await ticketApi.getAvailableSeats(movieId, showtime);
            if (err) throw err;
            setBookedSeats(response.data.bookedSeats);
        } catch (error) {
            console.error('Error fetching available seats:', error);
        }
    };

    const handleSeatSelection = (seats) => {
        setSelectedSeats(seats);
    };

    const handleShowtimeSelection = (time) => {
        setShowtime(time);
        setSelectedSeats([]); // Reset selected seats when showtime changes
    };

    const handleBooking = () => {
        if (!selectedSeats.length || !showtime) {
            toast.error('Please select seats and showtime');
            return;
        }
        setPaymentDialogOpen(true);
    };

    const handleRazorpayPayment = async () => {
        setProcessingPayment(true);
        try {
            // 1. Create order on backend
            const { data: order } = await axios.post(
                "/api/v1/payment/create-order",
                { amount: totalAmount, currency: "INR" }
            );

            // 2. Open Razorpay checkout
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CineHub",
                description: "Movie Ticket Booking",
                order_id: order.id,
                handler: async function (response) {
                    await handleBookingAfterPayment(response);
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#3399cc" },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.message || "Failed to initiate payment");
        } finally {
            setProcessingPayment(false);
            setPaymentDialogOpen(false);
        }
    };

    const handleBookingAfterPayment = async (razorpayResponse) => {
        try {
            const formattedSeats = selectedSeats.map(seat => ({
                row: seat[0].toUpperCase(),
                number: parseInt(seat.slice(1))
            }));

            const bookingData = {
                movieId,
                showtime,
                seats: formattedSeats,
                totalAmount,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
            };

            const { response, err } = await ticketApi.createBooking(bookingData);
            if (err) throw err;

            toast.success("Payment successful! Booking confirmed.");
            navigate("/my-bookings");
        } catch (error) {
            toast.error(error.message || "Failed to confirm booking after payment");
        }
    };

    // Helper for INR formatting
    const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    // Seat pricing logic
    const getSeatType = (seatId) => {
        const row = seatId[0].toUpperCase();
        if (row === 'A' || row === 'B') return 'VIP';
        if (['C', 'D', 'E'].includes(row)) return 'Premium';
        return 'Standard';
    };
    const getSeatPrice = (seatId) => {
        const type = getSeatType(seatId);
        if (type === 'VIP') return 800;
        if (type === 'Premium') return 500;
        return 300;
    };
    const totalAmount = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    color: 'primary.main',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                Booking Tickets for&nbsp;
                <Box
                    component="span"
                    sx={{
                        color: 'secondary.main',
                        fontWeight: 600,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        ml: 1
                    }}
                >
                    {movie?.title}
                </Box>
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={9}>
                    <Paper sx={{ p: 3 }}>
                        <SeatSelection
                            onSeatSelection={handleSeatSelection}
                            onShowtimeSelection={handleShowtimeSelection}
                            bookedSeats={bookedSeats}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <BookingSummary
                        movie={movie}
                        selectedSeats={selectedSeats}
                        showtime={showtime}
                        onBook={handleBooking}
                    />
                </Grid>
            </Grid>

            {/* Payment Confirmation Dialog */}
            <Dialog 
                open={paymentDialogOpen} 
                onClose={() => setPaymentDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    Confirm Payment
                    {processingPayment && <CircularProgress size={24} color="inherit" />}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Booking Details
                        </Typography>
                        <Typography variant="body1">
                            Movie: {movie?.title}
                        </Typography>
                        <Typography variant="body1">
                            Showtime: {showtime}
                        </Typography>
                        <Typography variant="body1">
                            Seats: {selectedSeats.join(', ')}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Summary
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                            Total Amount: {formatINR(totalAmount)}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Click confirm to proceed with the payment. You will be redirected to Razorpay's secure payment gateway.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Button 
                        onClick={() => setPaymentDialogOpen(false)}
                        disabled={processingPayment}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRazorpayPayment}
                        variant="contained"
                        disabled={processingPayment}
                        sx={{ minWidth: 120 }}
                    >
                        {processingPayment ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Booking; 