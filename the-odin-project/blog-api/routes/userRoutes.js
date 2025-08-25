const userController = require("../controllers/userController");
const { Router } = require("express");

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);

module.exports = userRouter;
