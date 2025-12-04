const path = require("node:path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const categoriesRouter = require("./routes/categoriesRouter");
const itemsRouter = require("./routes/itemsRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layout");

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.render("index", { title: "Inventory Management System" });
});

app.use("/categories", categoriesRouter);
app.use("/items", itemsRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:${PORT}`);
});
