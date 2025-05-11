const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

router.get("/", transactionsController.getAllTransactions);
router.get("/:id", transactionsController.getTransactionById);
router.post("/", transactionsController.createTransaction);
router.get("/product/:productId", transactionsController.getTransactionsByProduct);

module.exports = router;