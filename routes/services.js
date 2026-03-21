const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', serviceController.getServices);

// Get service by ID
router.get('/:id', serviceController.getServiceById);

// Get popular services
router.get('/popular/all', serviceController.getPopularServices);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

// Create service
router.post('/', serviceController.createService);

// Update service
router.put('/:id', serviceController.updateService);

// Delete service
router.delete('/:id', serviceController.deleteService);

module.exports = router;