const express = require("express")
const bookingRouter = express.Router()
const bookingController = require("../controller/booking.controller")
const authMiddleware = require("../middleware/auth.middleware")

bookingRouter.post("/bookings/:userSlug/:eventSlug",bookingController.booking)
bookingRouter.get("/bookings/:userSlug/:eventSlug",bookingController.getBooking)
bookingRouter.get("/bookings",authMiddleware,bookingController.showBooking)
bookingRouter.get("/bookings/:id",authMiddleware,bookingController.showDetailedBooking)
bookingRouter.delete("/bookings/:id",authMiddleware,bookingController.cancelBooking)
module.exports = bookingRouter