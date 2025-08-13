const express = require("express");
const app = express();
const messageRouter = require("./routes/messageRouter");
const indexRouter = require("./routes/indexRouter");

app.use("/messages", messageRouter);
app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:${PORT}`);
});
