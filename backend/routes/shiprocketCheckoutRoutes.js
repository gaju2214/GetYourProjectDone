// routes/shiprocketCheckoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/shiprocketCheckoutController');

// ==================== CATALOG SYNC APIs (For Shiprocket) ====================
router.get('/catalog/products', checkoutController.getProductsForShiprocket);
router.get('/catalog/collections', checkoutController.getCollectionsForShiprocket);
router.get('/catalog/products-by-collection', checkoutController.getProductsByCollection);

// ==================== CHECKOUT FLOW ====================
router.post('/generate-token', checkoutController.generateCheckoutToken);
router.post('/webhook/order', checkoutController.receiveCheckoutOrder);
router.get('/order/:order_id', checkoutController.getCheckoutOrderDetails);
router.post('/sync-all-products', checkoutController.syncAllProducts);
// Add this route
router.post('/generate-token-mock', checkoutController.generateMockCheckoutToken);

module.exports = router;
