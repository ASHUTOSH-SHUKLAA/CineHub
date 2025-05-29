import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['VIP', 'Premium', 'Standard'],
    required: true 
  },
  price: { type: Number, required: true }
});

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: String, required: true },
  showTime: { type: Date, required: true },
  seats: [seatSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: { type: Date, default: Date.now }
});

export default  mongoose.model("Ticket", ticketSchema);


