const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  const { levelId, limit = 10 } = req.query;
  if (!levelId) return res.status(400).send("levelId required");
  const top = await prisma.session.findMany({
    where: { levelId, status: "COMPLETED", durationMs: { not: null } },
    orderBy: { durationMs: "asc" },
    take: Number(limit),
    select: { playerName: true, durationMs: true, finishedAt: true },
  });
  res.json(top);
});

module.exports = router;
