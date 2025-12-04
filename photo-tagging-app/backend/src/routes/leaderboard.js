const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

// GET /api/leaderboard/:levelId
router.get("/:levelId", async (req, res) => {
  try {
    const { levelId } = req.params;
    const top = await prisma.session.findMany({
      where: { levelId, status: "COMPLETED", durationMs: { not: null } },
      orderBy: { durationMs: "asc" },
      take: 20,
      select: {
        id: true,
        playerName: true,
        durationMs: true,
        finishedAt: true,
      },
    });
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
