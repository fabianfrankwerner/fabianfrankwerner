const { randomUUID } = require("crypto");

function ensureSessionCookie(req, res) {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      // secure: true in production with https
    });
  }
  return sessionId;
}

module.exports = { ensureSessionCookie };
