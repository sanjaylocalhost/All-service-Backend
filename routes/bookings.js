const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// All booking routes require authentication
router.use(protect);

// Create booking
router.post('/', bookingController.createBooking);

// Get user bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status
router.put('/:id/status', bookingController.updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', bookingController.cancelBooking);

// Get provider bookings
router.get('/provider/:providerId', bookingController.getProviderBookings);

module.exports = router;