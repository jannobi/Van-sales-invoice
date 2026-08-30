const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('companyName').notEmpty(),
  body('businessType').notEmpty(),
  body('accessCode').notEmpty()
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], authController.login);

router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
