const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

// POST /api/guess
router.post("/", async (req, res) => {
  try {
    const { sessionId, characterSlug, x, y } = req.body;
    if (!sessionId || !characterSlug || x == null || y == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const target = await prisma.target.findFirst({
      where: { levelId: session.levelId, character: { slug: characterSlug } },
      include: { character: true },
    });
    if (!target) return res.status(404).json({ message: "Target not found" });

    const correct =
      x >= target.xMin &&
      x <= target.xMax &&
      y >= target.yMin &&
      y <= target.yMax;

    // prevent double-correct guesses for same character in the same session
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
    res.json({ correct, marker, message: correct ? "Correct!" : "Incorrect" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
