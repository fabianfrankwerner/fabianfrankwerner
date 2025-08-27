const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const debug = req.query.debug === "1";
    let { sessionId, characterSlug, x, y } = req.body;

    x = parseFloat(x);
    y = parseFloat(y);

    console.log("GUESS RECV:", { sessionId, characterSlug, x, y });

    if (!sessionId || !characterSlug || isNaN(x) || isNaN(y)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Find character by slug (safer than nested relation filter)
    const character = await prisma.character.findUnique({
      where: { slug: characterSlug },
    });
    if (!character)
      return res.status(404).json({ message: "Character not found" });

    // Find target for that level + character
    const target = await prisma.target.findFirst({
      where: { levelId: session.levelId, characterId: character.id },
    });

    if (!target) return res.status(404).json({ message: "Target not found" });

    // Tolerance: small padding to make clicking easier (3% default)
    const TOL = parseFloat(process.env.HIT_TOLERANCE) || 0.03;

    const xMin = target.xMin - TOL;
    const xMax = target.xMax + TOL;
    const yMin = target.yMin - TOL;
    const yMax = target.yMax + TOL;

    const correct = x >= xMin && x <= xMax && y >= yMin && y <= yMax;

    // prevent multiple correct guesses for same character
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

    const response = {
      correct,
      marker,
      message: correct ? "Correct!" : "Incorrect",
    };

    if (debug) {
      // DO NOT leave this enabled in production — it leaks target data
      response.debug = {
        target: {
          xMin: target.xMin,
          xMax: target.xMax,
          yMin: target.yMin,
          yMax: target.yMax,
        },
        tol: TOL,
        checkedBounds: { xMin, xMax, yMin, yMax },
        submitted: { x, y },
      };
    }

    console.log("GUESS RESULT:", {
      sessionId,
      characterSlug,
      correct,
      debug: !!debug,
    });
    res.json(response);
  } catch (err) {
    console.error("GUESS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
