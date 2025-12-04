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
indexRouter.post("/new", (req, res) => {
  messages.push({
    text: req.body.text,
    user: req.body.user,
    added: new Date(),
  });
  res.redirect("/");
});

module.exports = indexRouter;
