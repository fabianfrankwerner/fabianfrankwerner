const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contact", function (req, res) {
  res.sendFile(path.join(__dirname, "contact.html"));
});

app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

app.listen(port, function () {
  console.log("Server started at http://localhost:" + port);
});
