const { Router } = require("express");

const messageRouter = Router();

messageRouter.get("/", (req, res) => res.send("All messages"));
messageRouter.get("/:messageId", (req, res) => {
  const { messageId } = req.params;
  res.send(`Message ID: ${messageId}`);
});

module.exports = messageRouter;
