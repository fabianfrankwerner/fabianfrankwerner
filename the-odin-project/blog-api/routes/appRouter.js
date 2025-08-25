const appController = require("../controllers/appController");
const { Router } = require("express");

const appRouter = Router();

appRouter.get("/", appController.index);

module.exports = appRouter;
