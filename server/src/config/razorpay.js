import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.rzp_test_YXr04tDAMTsnbu,
  key_secret: process.env.wXeJdibJFEg654Vw9JwdyUng,
});
