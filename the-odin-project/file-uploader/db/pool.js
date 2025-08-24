const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: "fabianfrankwerner",
  database: "file_uploader",
  password: "",
  port: 5432,
});
