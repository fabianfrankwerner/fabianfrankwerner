const express = require("express");
const prisma = require("../lib/prisma");
const { ensureSessionCookie } = require("../lib/cookies");
const router = express.Router();

// POST /api/sessions/start
router.post("/start", async (req, res) => {
  try {
    ensureSessionCookie(req, res);
    const { levelId } = req.body;
    if (!levelId) return res.status(400).json({ message: "levelId required" });
    const session = await prisma.session.create({ data: { levelId } });
    // return session object
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/finish
router.post("/finish", async (req, res) => {
  try {
    const { sessionId, playerName } = req.body;
    if (!sessionId)
      return res.status(400).json({ message: "sessionId required" });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - session.startedAt.getTime();

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: { finishedAt, durationMs, playerName, status: "COMPLETED" },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
