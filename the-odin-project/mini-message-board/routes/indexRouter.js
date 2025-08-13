const { Router } = require("express");

const messageRouter = Router();

const messages = [
    {
      text: "Hi",
      user: "Amando",
      added: new Date()
    },
    {
      text: "Hello, World!",
      user: "Charles",
      added: new Date()
    }
  ];
  

messageRouter.get("/", (req, res) => res.send("Index"));
messageRouter.get("/*splat", (req, res) => res.send("404"));

module.exports = messageRouter;
