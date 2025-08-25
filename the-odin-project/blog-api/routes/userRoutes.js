const userController = require("../controllers/userController");
const { authenticateToken, requireAuthor } = require("../middleware/auth");
const { Router } = require("express");

const userRouter = Router();

// Public routes (no authentication required)
userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);

// Protected routes (authentication required)
userRouter.get(
  "/",
  authenticateToken,
  requireAuthor,
  userController.getAllUsers
);
userRouter.get("/:id", authenticateToken, userController.getUserById);
userRouter.post(
  "/",
  authenticateToken,
  requireAuthor,
  userController.createUser
);
userRouter.put("/:id", authenticateToken, userController.updateUser);
userRouter.delete(
  "/:id",
  authenticateToken,
  requireAuthor,
  userController.deleteUser
);

module.exports = userRouter;
