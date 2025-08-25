const appRouter = require("./routes/appRouter");
const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use("/", appRouter);

const PORT = process.env.PORT;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`http://localhost:${PORT}`);
});
