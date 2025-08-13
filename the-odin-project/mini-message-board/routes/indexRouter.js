const { Router } = require("express");

const indexRouter = Router();

const messages = [
  {
    text: "Hi",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello, World!",
    user: "Charles",
    added: new Date(),
  },
];

indexRouter.get("/", (req, res) =>
  res.render("index", { title: "Board", messages: messages })
);
indexRouter.get("/*splat", (req, res) => res.send("404"));

module.exports = indexRouter;
