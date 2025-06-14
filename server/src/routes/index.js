import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import personRoute from "./person.route.js";
import reviewRoute from "./review.route.js";
import ticketRoute from "./ticket.route.js";
import paymentRoutes from "./payment.routes.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/person", personRoute);
router.use("/reviews", reviewRoute);
router.use("/tickets", ticketRoute);
router.use("/payment", paymentRoutes);
router.use("/:mediaType", mediaRoute);

export default router;