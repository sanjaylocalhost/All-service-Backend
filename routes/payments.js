const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// All payment routes require authentication
router.use(protect);

// Create payment order
router.post('/create-order', paymentController.createOrder);

// Verify payment
router.post('/verify', paymentController.verifyPayment);

// Get payment history
router.get('/history', paymentController.getPaymentHistory);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Refund payment
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;