import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Movie, AccessTime, EventSeat, Cancel, Info } from '@mui/icons-material';
import ticketApi from '../api/modules/ticket.api';
import { routesGen } from '../routes/routes';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const { response, err } = await ticketApi.getUserBookings();
            if (err) throw err;
            setBookings(response.data);
        } catch (error) {
            setError(error.message || 'Failed to fetch bookings');
            toast.error(error.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const { response, err } = await ticketApi.cancelBooking(bookingId);
            if (err) throw err;
            toast.success('Booking cancelled successfully');
            setCancelDialogOpen(false);
            fetchBookings(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'Failed to cancel booking');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="80vh"
                flexDirection="column"
                gap={2}
            >
                <CircularProgress size={40} />
                <Typography variant="h6" color="text.secondary">
                    Loading your bookings...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>
                <Alert 
                    severity="error" 
                    sx={{ mb: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={fetchBookings}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, md: 10 } }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: 'primary.main',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Movie /> My Bookings
            </Typography>

            {bookings.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You haven't made any bookings yet. Start by booking tickets for your favorite movies!
                </Alert>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white' }}>Movie</TableCell>
                                <TableCell sx={{ color: 'white' }}>Showtime</TableCell>
                                <TableCell sx={{ color: 'white' }}>Seats</TableCell>
                                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow 
                                    key={booking._id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <Button
                                            onClick={() => navigate(routesGen.mediaDetail('movie', booking.movieId._id))}
                                            startIcon={<Movie />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {booking.movieId.title}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccessTime fontSize="small" />
                                            {dayjs(booking.showtime).format('MMM D, YYYY h:mm A')}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventSeat fontSize="small" />
                                            {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" color="primary" fontWeight="bold">
                                            {formatINR(booking.totalAmount)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={booking.status}
                                            color={getStatusColor(booking.status)}
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {booking.status === 'pending' && (
                                                <Tooltip title="Cancel Booking">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setCancelDialogOpen(true);
                                                        }}
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Details">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                    }}
                                                >
                                                    <Info />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Cancel Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Cancel /> Cancel Booking
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to cancel this booking?
                    </Typography>
                    {selectedBooking && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Movie: {selectedBooking.movieId.title}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Showtime: {dayjs(selectedBooking.showtime).format('MMM D, YYYY h:mm A')}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Seats: {selectedBooking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Button onClick={() => setCancelDialogOpen(false)}>
                        Keep Booking
                    </Button>
                    <Button
                        onClick={() => handleCancelBooking(selectedBooking?._id)}
                        variant="contained"
                        color="error"
                    >
                        Cancel Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingHistory; 