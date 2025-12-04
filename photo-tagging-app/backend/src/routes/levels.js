const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

// GET /api/levels
router.get("/", async (req, res) => {
  const levels = await prisma.level.findMany({
    select: {
      id: true,
      title: true,
      imageUrl: true,
      naturalWidth: true,
      naturalHeight: true,
    },
  });
  res.json(levels);
});

// GET /api/levels/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const level = await prisma.level.findUnique({
    where: { id },
    include: { targets: { include: { character: true } } },
  });
  if (!level) return res.status(404).json({ message: "Level not found" });

  // produce character list (unique characters)
  const chars = level.targets.map((t) => ({
    name: t.character.name,
    slug: t.character.slug,
  }));
  res.json({
    id: level.id,
    title: level.title,
    imageUrl: level.imageUrl,
    naturalWidth: level.naturalWidth,
    naturalHeight: level.naturalHeight,
    characters: chars,
  });
});

module.exports = router;
