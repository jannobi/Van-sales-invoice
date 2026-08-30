const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.post('/subscribe', auth, paymentController.subscribe);
router.post('/verify', auth, paymentController.verifyPayment);
router.post('/webhook', paymentController.webhook);

module.exports = router;
