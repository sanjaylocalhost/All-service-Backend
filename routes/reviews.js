const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Get reviews for a provider
router.get('/provider/:providerId', reviewController.getProviderReviews);

// Protected routes
router.use(protect);

// Create review
router.post('/', reviewController.createReview);

// Update review
router.put('/:id', reviewController.updateReview);

// Delete review
router.delete('/:id', reviewController.deleteReview);

// Get user reviews
router.get('/user/my-reviews', reviewController.getUserReviews);

module.exports = router;