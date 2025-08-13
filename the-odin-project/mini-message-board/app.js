const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Index"));
app.get("/new", (req, res) => res.send("Message"));

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:${PORT}`);
});
