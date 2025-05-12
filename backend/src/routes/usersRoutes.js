const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.post("/login", usersController.login);
router.post("/register", usersController.createUser);

// Protected routes (require authentication)
router.use(authMiddleware);

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.put("/:id/password", usersController.updatePassword);

module.exports = router;