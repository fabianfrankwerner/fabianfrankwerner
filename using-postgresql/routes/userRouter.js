const { Router } = require("express");
const userController = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/", userController.getUsernames);
userRouter.get("/new", userController.createUsernameGet);
userRouter.post("/new", userController.createUsernamePost);

module.exports = userRouter;
