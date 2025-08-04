const fs = require("fs");
const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile(__dirname + "/index.html", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Server error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
});

server.listen(8080);
