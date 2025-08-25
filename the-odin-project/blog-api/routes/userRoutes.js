const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken, requireAuthor } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/login", userController.login);
router.post("/register", userController.register);

// Upgrade route - allows users to upgrade their own role (must be before /:id routes)
router.patch("/upgrade", authenticateToken, userController.upgradeUser);

// Protected routes
router.get("/", authenticateToken, requireAuthor, userController.getAllUsers);
router.get(
  "/:id",
  authenticateToken,
  requireAuthor,
  userController.getUserById
);
router.post("/", authenticateToken, requireAuthor, userController.createUser);
router.put("/:id", authenticateToken, requireAuthor, userController.updateUser);
router.delete(
  "/:id",
  authenticateToken,
  requireAuthor,
  userController.deleteUser
);

module.exports = router;
