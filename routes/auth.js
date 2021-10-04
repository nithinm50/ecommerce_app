const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/user');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('firstName')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;