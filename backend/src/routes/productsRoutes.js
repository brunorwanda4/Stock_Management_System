const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all product routes
router.use(authMiddleware);

router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", productsController.createProduct);
router.put("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;