import Ticket from '../routes/models/ticket.model.js';
import Movie from '../routes/models/movie.model.js';

const SEAT_PRICES = {
  VIP: 800,
  Premium: 500,
  Standard: 300
};

const ticketController = {
    // Create a new booking
    createBooking: async (req, res) => {
        try {
            const { movieId, showtime, seats } = req.body;
            const userId = req.user.id;

            // Check if movie exists
            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Calculate total amount based on seat types
            const seatsWithPrices = seats.map(seat => ({
                ...seat,
                price: SEAT_PRICES[seat.type]
            }));

            const totalAmount = seatsWithPrices.reduce((sum, seat) => sum + seat.price, 0);

            // Check if seats are available
            const existingBookings = await Ticket.find({
                movieId,
                showtime,
                status: { $ne: 'cancelled' }
            });

            const bookedSeats = existingBookings.reduce((acc, booking) => {
                return [...acc, ...booking.seats.map(seat => `${seat.row}${seat.number}`)];
            }, []);

            const isSeatAvailable = seats.every(seat => 
                !bookedSeats.includes(`${seat.row}${seat.number}`)
            );

            if (!isSeatAvailable) {
                return res.status(400).json({ message: 'Some selected seats are no longer available' });
            }

            // Create new booking
            const ticket = new Ticket({
                userId,
                movieId,
                showtime,
                seats: seatsWithPrices,
                totalAmount
            });

            await ticket.save();
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user's bookings
    getUserBookings: async (req, res) => {
        try {
            const userId = req.user.id;
            const tickets = await Ticket.find({ userId })
                .populate('movieId')
                .sort({ bookingDate: -1 });
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get booking details
    getBookingDetails: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id)
                .populate('movieId')
                .populate('userId', 'name email');
            
            if (!ticket) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Check if the booking belongs to the user
            if (ticket.userId._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cancel booking
    cancelBooking: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id);
            
            if (!ticket) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Check if the booking belongs to the user
            if (ticket.userId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            // Check if the showtime is in the future
            if (new Date(ticket.showtime) < new Date()) {
                return res.status(400).json({ message: 'Cannot cancel past bookings' });
            }

            ticket.status = 'cancelled';
            await ticket.save();

            res.status(200).json({ message: 'Booking cancelled successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get available seats for a movie and showtime
    getAvailableSeats: async (req, res) => {
        try {
            const { movieId, showtime } = req.query;

            // Get all bookings for the movie and showtime
            const existingBookings = await Ticket.find({
                movieId,
                showtime,
                status: { $ne: 'cancelled' }
            });

            // Get all booked seats
            const bookedSeats = existingBookings.reduce((acc, booking) => {
                return [...acc, ...booking.seats.map(seat => `${seat.row}${seat.number}`)];
            }, []);

            // Return available seats with their prices
            const seatPrices = {
                VIP: 800,
                Premium: 500,
                Standard: 300
            };

            res.status(200).json({ 
                bookedSeats,
                seatPrices
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Book a ticket
    bookTicket: async (req, res) => {
        try {
            const { movieId, showTime, seats } = req.body;
            const user = req.user._id;
            const ticket = await Ticket.create({ user, movieId, showTime, seats });
            res.status(201).json(ticket);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get user's tickets
    getUserTickets: async (req, res) => {
        try {
            const tickets = await Ticket.find({ user: req.user._id });
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default ticketController; 