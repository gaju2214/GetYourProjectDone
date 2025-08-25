const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// POST /api/payment/order
router.post("/order", paymentController.createOrder);

module.exports = router;
