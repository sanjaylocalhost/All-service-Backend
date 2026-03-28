// backend/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getNearbyAddresses
} = require('../controllers/addressController');
// const { protect } = require('../middleware/authMiddleware');

// All routes are protected (require authentication)
// router.use(protect);

// Address routes
router.route('/')
  .get(getAddresses)
  .post(createAddress);

router.get('/nearby', getNearbyAddresses);
router.put('/:id/default', setDefaultAddress);

router.route('/:id')
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

module.exports = router;