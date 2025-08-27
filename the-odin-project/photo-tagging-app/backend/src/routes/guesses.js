const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

// POST { sessionId, characterSlug, x, y }   x,y are normalized 0..1
router.post("/", async (req, res) => {
  const { sessionId, characterSlug, x, y } = req.body;
  if (!sessionId || !characterSlug || x == null || y == null)
    return res.status(400).send("Missing fields");

  // load session and level
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) return res.status(404).send("Session not found");

  const target = await prisma.target.findFirst({
    where: { levelId: session.levelId, character: { slug: characterSlug } },
    include: { character: true },
  });

  if (!target) return res.status(404).send("Target not found");

  const correct =
    x >= target.xMin &&
    x <= target.xMax &&
    y >= target.yMin &&
    y <= target.yMax;

  // prevent multiple correct guesses for same character in the session
  const alreadyCorrect = await prisma.guess.findFirst({
    where: { sessionId, characterId: target.characterId, correct: true },
  });

  if (correct && alreadyCorrect) {
    return res.json({ correct: false, message: "Already found" });
  }

  const guess = await prisma.guess.create({
    data: {
      sessionId,
      characterId: target.characterId,
      x,
      y,
      correct,
    },
  });

  const marker = correct
    ? {
        x: (target.xMin + target.xMax) / 2,
        y: (target.yMin + target.yMax) / 2,
      }
    : null;

  res.json({ correct, marker });
});

module.exports = router;
