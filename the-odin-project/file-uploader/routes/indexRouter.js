const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
indexRouter.get("/sign-up", indexController.signUpGet);
// indexRouter.post("/sign-up", indexController.signUpPost);
// indexRouter.get("/log-in", indexController.logInGet);
// indexRouter.post("/log-in", indexController.logInPost);
// indexRouter.get("/log-out", indexController.logOutGet);
// indexRouter.post("/upgrade", indexController.upgradePost);
// indexRouter.post("/messages", indexController.createMessagePost);
// indexRouter.post("/messages/:id/delete", indexController.deleteMessagePost);

module.exports = indexRouter;
