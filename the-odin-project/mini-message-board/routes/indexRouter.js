const { Router } = require("express");

const messageRouter = Router();

messageRouter.get("/", (req, res) => res.send("Index"));
messageRouter.get("/*splat", (req, res) => res.send("404"));

module.exports = messageRouter;
