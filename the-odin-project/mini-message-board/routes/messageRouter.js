const { Router } = require("express");

const messageRouter = Router();

messageRouter.get("/", (req, res) => res.send("New message"));

module.exports = messageRouter;
