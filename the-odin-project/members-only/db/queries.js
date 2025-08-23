const pool = require("./pool");

async function insertUser(first_name, last_name, email, password) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    [first_name, last_name, email, password]
  );
}

async function getUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
};
