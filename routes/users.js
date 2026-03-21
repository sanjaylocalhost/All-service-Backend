const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', protect, userController.getProfile);

// Update user profile
router.put('/profile', protect, userController.updateProfile);

// Get user bookings
router.get('/bookings', protect, userController.getUserBookings);

// Add address
router.post('/address', protect, userController.addAddress);

// Update address
router.put('/address/:addressId', protect, userController.updateAddress);

// Delete address
router.delete('/address/:addressId', protect, userController.deleteAddress);

module.exports = router;