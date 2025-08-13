const path = require("node:path");
const express = require("express");
const app = express();
const messageRouter = require("./routes/messageRouter");
const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/new", messageRouter);
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:${PORT}`);
});
