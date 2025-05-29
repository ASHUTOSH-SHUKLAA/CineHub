import express from 'express';
import ticketController from '../controllers/ticket.controller.js';
import tokenMiddleware from '../middlewares/token.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(tokenMiddleware.auth);

// Create a new booking
router.post('/', ticketController.createBooking);

// Get all bookings for the authenticated user
router.get('/my-bookings', ticketController.getUserBookings);

// Get specific booking details
router.get('/:id', ticketController.getBookingDetails);

// Cancel a booking
router.patch('/:id/cancel', ticketController.cancelBooking);

// Get available seats for a movie and showtime
router.get('/available-seats', ticketController.getAvailableSeats);

export default router; 