const express = require("express");
const prisma = require("../lib/prisma");
const { ensureSessionCookie } = require("../lib/cookies");
const router = express.Router();

router.post("/start", async (req, res) => {
  const sessionCookie = ensureSessionCookie(req, res);
  const { levelId } = req.body;
  const session = await prisma.session.create({
    data: { levelId },
  });
  // attach sessionId in cookie so client persists it (optional)
  res.cookie("gameSessionId", session.id, { httpOnly: true, sameSite: "lax" });
  res.json(session);
});

router.post("/finish", async (req, res) => {
  const { sessionId, playerName } = req.body;
  const session = await prisma.session.update({
    where: { id: sessionId },
    data: {
      finishedAt: new Date(),
      playerName,
      durationMs: {
        // computed server-side: finishedAt - startedAt
        set: null,
      },
    },
  });
  // compute duration and update
  const started = session.startedAt;
  const finished = new Date();
  const durationMs = finished - started;
  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { finishedAt: finished, durationMs, status: "COMPLETED" },
  });
  res.json(updated);
});

module.exports = router;
