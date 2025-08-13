const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Index"));
// change to app.post()
app.get("/new", (req, res) => res.send("New Message"));
app.get("/*splat", (req, res) => res.send("404"));

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:${PORT}`);
});
