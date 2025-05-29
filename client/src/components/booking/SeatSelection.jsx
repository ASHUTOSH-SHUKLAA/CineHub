import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

const SeatButton = styled(ToggleButton)(({ theme, seattype }) => ({
    width: '35px',
    height: '35px',
    margin: '2px',
    padding: 0,
    fontSize: '0.8rem',
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
    ...(seattype === 'premium' && {
        backgroundColor: '#9c27b0',
        color: 'white',
        '&:hover': {
            backgroundColor: '#7b1fa2',
        },
    }),
    ...(seattype === 'vip' && {
        backgroundColor: '#673ab7',
        color: 'white',
        '&:hover': {
            backgroundColor: '#512da8',
        },
    }),
    ...(seattype === 'standard' && {
        backgroundColor: '#e1bee7',
        color: '#4a148c',
        '&:hover': {
            backgroundColor: '#ce93d8',
        },
    }),
}));

const Screen = styled(Box)(({ theme }) => ({
    width: '80%',
    height: '70px',
    margin: '0 auto 40px',
    background: 'linear-gradient(180deg, #e0e0e0 0%, #f5f5f5 100%)',
    borderRadius: '5px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '20px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
        borderRadius: '50%',
    }
}));

const SeatSelection = ({ onSeatSelection, onShowtimeSelection, bookedSeats = [] }) => {
    const theme = useTheme();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState('');

    const showtimes = [
        '10:00 AM',
        '1:00 PM',
        '4:00 PM',
        '7:00 PM',
        '10:00 PM'
    ];

    // Enhanced seat layout with different sections
    const seatLayout = {
        vip: {
            rows: ['A', 'B'],
            seatsPerRow: 8,
            price: 800
        },
        premium: {
            rows: ['C', 'D', 'E'],
            seatsPerRow: 10,
            price: 500
        },
        standard: {
            rows: ['F', 'G', 'H', 'I', 'J'],
            seatsPerRow: 12,
            price: 300
        }
    };

    const handleSeatClick = (row, number, type) => {
        const seatId = `${row}${number}`;
        setSelectedSeats(prev => {
            const newSelection = prev.includes(seatId)
                ? prev.filter(seat => seat !== seatId)
                : [...prev, seatId];
            onSeatSelection(newSelection);
            return newSelection;
        });
    };

    const handleShowtimeChange = (event, newShowtime) => {
        if (newShowtime !== null) {
            setSelectedShowtime(newShowtime);
            onShowtimeSelection(newShowtime);
        }
    };

    const isSeatBooked = (seatId) => {
        return bookedSeats.includes(seatId);
    };

    const renderSeatSection = (section, type) => {
        const { rows, seatsPerRow } = section;
        return (
            <Box key={type} sx={{ mb: 3 }}>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        mb: 1,
                        color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                        fontWeight: 'bold'
                    }}
                >
                    {type.toUpperCase()} Section (₹{section.price})
                </Typography>
                {rows.map((row) => (
                    <Box key={row} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                width: '20px',
                                textAlign: 'center',
                                lineHeight: '35px',
                                mr: 1,
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            {row}
                        </Typography>
                        {Array.from({ length: seatsPerRow }, (_, i) => {
                            const seatNumber = i + 1;
                            const seatId = `${row}${seatNumber}`;
                            const isSelected = selectedSeats.includes(seatId);
                            const isDisabled = isSeatBooked(seatId);

                            return (
                                <SeatButton
                                    key={seatId}
                                    value={seatId}
                                    selected={isSelected}
                                    disabled={isDisabled}
                                    seattype={type}
                                    onClick={() => handleSeatClick(row, seatNumber, type)}
                                >
                                    {seatNumber}
                                </SeatButton>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box>
            <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                }}
            >
                Select Showtime
            </Typography>
            <ToggleButtonGroup
                value={selectedShowtime}
                exclusive
                onChange={handleShowtimeChange}
                sx={{ mb: 4 }}
            >
                {showtimes.map((time) => (
                    <ToggleButton key={time} value={time}>
                        {time}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                }}
            >
                Select Seats
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    borderRadius: 2
                }}
            >
                <Screen>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: theme.palette.mode === 'dark' ? 'white' : 'text.secondary'
                        }}
                    >
                        SCREEN
                    </Typography>
                </Screen>

                {Object.entries(seatLayout).map(([type, section]) => 
                    renderSeatSection(section, type)
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: 'primary.main',
                                borderRadius: 1
                            }}
                        />
                        <Typography 
                            variant="body2"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            Selected
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: 'grey.300',
                                borderRadius: 1
                            }}
                        />
                        <Typography 
                            variant="body2"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            Unavailable
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#9c27b0',
                                borderRadius: 1
                            }}
                        />
                        <Typography 
                            variant="body2"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            Premium
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#673ab7',
                                borderRadius: 1
                            }}
                        />
                        <Typography 
                            variant="body2"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            VIP
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#e1bee7',
                                borderRadius: 1
                            }}
                        />
                        <Typography 
                            variant="body2"
                            sx={{ 
                                color: theme.palette.mode === 'dark' ? 'white' : 'text.primary'
                            }}
                        >
                            Standard
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default SeatSelection; 