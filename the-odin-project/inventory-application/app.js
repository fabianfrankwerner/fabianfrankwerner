require("dotenv").config();

const { Pool } = require("pg");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4242;

app.get("/", async (_, res) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const client = await pool.connect();
  const result = await client.query("SELECT version()");
  client.release();
  const { version } = result.rows[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
