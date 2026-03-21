const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');


console.log('Auth Controller loaded:', {
  register: typeof authController.register,
  login: typeof authController.login,
  sendOTP: typeof authController.sendOTP,
  verifyOTP: typeof authController.verifyOTP
});


// Register route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('mobile').isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  authController.register
);

// Login route
router.post(
  '/login',
  [
    body('mobile').notEmpty().withMessage('Mobile number is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Send OTP route
router.post(
  '/send-otp',
  [
    body('mobile').isLength({ min: 10, max: 10 }).withMessage('Valid mobile number required'),
  ],
  authController.sendOTP
);

// Verify OTP route
router.post(
  '/verify-otp',
  [
    body('mobile').notEmpty().withMessage('Mobile number required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid OTP required'),
  ],
  authController.verifyOTP
);

module.exports = router;