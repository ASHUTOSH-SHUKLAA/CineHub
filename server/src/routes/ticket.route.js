import express from "express";
import ticketController from "../controllers/ticket.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

// Create a new booking
router.post("/", tokenMiddleware.auth, ticketController.createBooking);

// Get user's bookings
router.get("/", tokenMiddleware.auth, ticketController.getUserBookings);

// Get booking details
router.get("/:id", tokenMiddleware.auth, ticketController.getBookingDetails);

// Cancel booking
router.put("/:id/cancel", tokenMiddleware.auth, ticketController.cancelBooking);

// Get available seats
router.get("/available-seats", tokenMiddleware.auth, ticketController.getAvailableSeats);

export default router; 