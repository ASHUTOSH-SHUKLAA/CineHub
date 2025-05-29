import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
    Alert
} from '@mui/material';
import { AccessTime, EventSeat, Movie } from '@mui/icons-material';

const BookingSummary = ({ movie, selectedSeats, showtime, onBook }) => {
    // Pricing rules
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
    const formatINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;
    const totalAmount = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);

    const getSeatTypeColor = (type) => {
        switch (type) {
            case 'VIP': return 'error';
            case 'Premium': return 'warning';
            default: return 'success';
        }
    };

    return (
        <Paper 
            sx={{ 
                p: 3, 
                position: 'sticky', 
                top: 20,
                boxShadow: 3,
                borderRadius: 2
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Movie /> Booking Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Movie /> Movie Details
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    {movie?.title}
                </Typography>
                {showtime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">
                            {showtime}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <EventSeat /> Selected Seats
                </Typography>
                {selectedSeats.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        No seats selected
                    </Alert>
                ) : (
                    <List dense>
                        {selectedSeats.map((seat) => {
                            const type = getSeatType(seat);
                            return (
                                <ListItem 
                                    key={seat}
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                            label={type} 
                                            size="small" 
                                            color={getSeatTypeColor(type)}
                                        />
                                        <Typography variant="body2">
                                            Seat {seat}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="primary">
                                        {formatINR(getSeatPrice(seat))}
                                    </Typography>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Total Amount
                </Typography>
                <Typography 
                    variant="h4" 
                    color="primary"
                    sx={{ 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    {formatINR(totalAmount)}
                </Typography>
            </Box>

            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={onBook}
                disabled={!selectedSeats.length || !showtime}
                sx={{ 
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                }}
            >
                {!selectedSeats.length ? 'Select Seats' : 
                 !showtime ? 'Select Showtime' : 
                 'Proceed to Payment'}
            </Button>
        </Paper>
    );
};

export default BookingSummary; 