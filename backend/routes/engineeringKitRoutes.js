const express = require("express");
const router = express.Router();
const engineeringKitController = require("../controllers/engineeringKitController");

// Subcategories
router.post("/subcategories", engineeringKitController.createEngineeringSubcategory);
router.get("/subcategories", engineeringKitController.getAllEngineeringSubcategories);
router.put("/subcategories/:id", engineeringKitController.updateEngineeringSubcategory);
router.delete("/subcategories/:id", engineeringKitController.deleteEngineeringSubcategory);

// Engineering Kits
router.post("/", engineeringKitController.createEngineeringKit);
router.get("/", engineeringKitController.getAllEngineeringKits);
router.get("/by-subcategory/:subcategoryId", engineeringKitController.getEngineeringKitsBySubcategory);
router.get("/:id", engineeringKitController.getEngineeringKitById);
router.put("/:id", engineeringKitController.updateEngineeringKit);
router.delete("/:id", engineeringKitController.deleteEngineeringKit);

module.exports = router;
