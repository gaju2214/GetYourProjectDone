const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyOtpRequired = require('../middleware/verifyOtp');

router.post('/add', verifyOtpRequired, cartController.addToCart);
router.get('/:userId', verifyOtpRequired, cartController.getCart);
router.delete('/:id', verifyOtpRequired, cartController.removeFromCart);
router.put("/update/:id", verifyOtpRequired, cartController.updateQuantity);

module.exports = router;
