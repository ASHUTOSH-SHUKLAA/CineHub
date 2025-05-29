import stripe from 'stripe';
import Ticket from '../models/ticket.model.js';
import Razorpay from 'razorpay';
import { razorpayInstance } from '../config/razorpay.js';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Never hardcode secrets!
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  createPaymentIntent: async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amount * 100,
        currency: 'INR',
        metadata: { bookingId },
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  confirmPayment: async (req, res) => {
    try {
      const { bookingId, paymentIntentId } = req.body;
      const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not successful' });
      }

      const ticket = await Ticket.findById(bookingId);
      if (!ticket) return res.status(404).json({ message: 'Booking not found' });

      ticket.status = 'confirmed';
      ticket.paymentId = paymentIntentId;
      await ticket.save();

      res.status(200).json({ message: 'Payment confirmed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createOrder: async (req, res) => {
    try {
      const { amount, currency = "INR" } = req.body;
      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${Date.now()}`,
      });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default paymentController;