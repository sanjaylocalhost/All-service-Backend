const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const providerController = require('../controllers/providerController');

// Get all providers (with filters)
router.get('/', providerController.getProviders);

// Get featured providers
router.get('/featured', providerController.getFeaturedProviders);

// Get provider by ID
router.get('/:id', providerController.getProviderById);

// Get providers by service
router.get('/service/:service', providerController.getProvidersByService);

// Get providers near location
router.get('/nearby/:lat/:lng', providerController.getNearbyProviders);

// Protected routes (require authentication)
router.use(protect);

// Register as provider
router.post('/register', providerController.registerProvider);

// Update provider profile
router.put('/:id', providerController.updateProvider);

// Update availability
router.put('/:id/availability', providerController.updateAvailability);

// Get provider earnings
router.get('/:id/earnings', providerController.getEarnings);

// Withdraw earnings
router.post('/:id/withdraw', providerController.withdrawEarnings);

// Add review
router.post('/:id/reviews', providerController.addReview);

// Get provider reviews
router.get('/:id/reviews', providerController.getProviderReviews);

module.exports = router;