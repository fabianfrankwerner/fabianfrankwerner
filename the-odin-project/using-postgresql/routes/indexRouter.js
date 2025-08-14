const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.render("index", { title: "Index" }));
indexRouter.post("/new", (req, res) => {
  console.log("username to be saved: ", req.body.username);
  res.redirect("/");
});

module.exports = indexRouter;
