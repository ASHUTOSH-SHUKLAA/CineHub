import express from "express";
import paymentController from "../controllers/payment.controller.js";
// import { paymentController } from "../controllers/payment.controller.js";
const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Confirm payment
router.post('/confirm', paymentController.confirmPayment);

router.post("/create-order", paymentController.createOrder);

export default router; 