const express = require("express");
const app = express();

app.get("/", (req, res) => console.log("usernames will be logged here - wip"));

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}!`);
});
