const { Pool } = require("pg");

module.exports = new Pool({
  connectionString:
    "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
});
