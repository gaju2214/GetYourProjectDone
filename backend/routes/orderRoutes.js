const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/add", orderController.addOrder); // ✅ new route
router.post("/place", orderController.placeOrder);
router.get("/user/:userId", orderController.getOrdersByUser);
router.post("/", orderController.createOrder);

module.exports = router;

// const express = require("express");
// const {
//   placeOrder,
//   getOrdersByUser,
// } = require("../controllers/orderController");
// const router = express.Router();

// router.post("/place", placeOrder);
// router.get("/:userId", getOrdersByUser);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');

// router.post('/place', orderController.placeOrder);
// router.get('/:userId', orderController.getOrdersByUser);

// module.exports = router;
