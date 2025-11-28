const express = require("express");
const router = express.Router();
const shiprocketController = require("../controllers/shiprocketController");

// Debug endpoint
router.get('/debug-shiprocket', shiprocketController.debugShiprocket);
router.get('/debug-env', shiprocketController.debugEnv);

// Main endpoints
router.post("/create", shiprocketController.createShiprocketOrder);
router.get("/orders", shiprocketController.getAllShiprocketOrders); // Add this
router.get("/order/:order_id", shiprocketController.getShiprocketOrder);
router.get("/track/:shipment_id", shiprocketController.trackShipment);
router.post("/cancel/:order_id", shiprocketController.cancelShiprocketOrder);

module.exports = router;
