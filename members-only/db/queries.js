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

async function updateMembershipStatus(userId, status) {
  await pool.query("UPDATE users SET membership_status = $1 WHERE id = $2", [
    status,
    userId,
  ]);
}

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT m.*, u.first_name, u.last_name, u.membership_status 
    FROM messages m 
    JOIN users u ON m.user_id = u.id 
    ORDER BY m.created_at DESC
  `);
  return rows;
}

async function createMessage(title, body, userId) {
  await pool.query(
    "INSERT INTO messages (title, body, user_id) VALUES ($1, $2, $3)",
    [title, body, userId]
  );
}

async function deleteMessage(messageId) {
  await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
}

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  updateMembershipStatus,
  getAllMessages,
  createMessage,
  deleteMessage,
};
