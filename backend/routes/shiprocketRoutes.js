const express = require("express");
const router = express.Router();
const shiprocketController = require("../controllers/shiprocketController");

// router.get("/login", shiprocketController.shiprocketLogin);
router.post("/create", shiprocketController.createShiprocketOrder);

module.exports = router;
