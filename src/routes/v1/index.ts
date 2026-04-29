import { Router } from "express";
import authRouter from "./auth.routes";
import usersRouter from "./users.routes";
import listingsRouter from "./listings.routes";
import bookingsRouter from "./bookings.routes";
import reviewsRouter from "./reviews.routes";
import statsRouter from "./stats.routes";
import uploadRouter from "./upload.routes";
import { authenticate, requireAdmin } from "../../middlewares/auth.middleware";

const v1Router = Router();

// Auth routes (public)
v1Router.use("/auth", authRouter);

// Upload routes (must come before /users to avoid admin middleware)
v1Router.use(uploadRouter);

// User routes (admin only)
v1Router.use("/users", authenticate, requireAdmin, usersRouter);

// Listing routes
v1Router.use("/listings", listingsRouter);

// Booking routes
v1Router.use("/bookings", bookingsRouter);

// Review routes (includes both /listings/:id/reviews and /reviews/:id)
v1Router.use(reviewsRouter);

// Stats routes
v1Router.use(statsRouter);

export default v1Router;