require("dotenv").config();
const { randomUUID } = require("crypto");

function ensureSessionCookie(req, res) {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return sessionId;
}

module.exports = { ensureSessionCookie };
