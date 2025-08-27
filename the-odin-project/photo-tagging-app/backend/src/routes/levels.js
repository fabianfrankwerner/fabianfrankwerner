const express = require("express");
const prisma = require("../lib/prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  const levels = await prisma.level.findMany({
    select: { id: true, title: true, imageUrl: true },
  });
  res.json(levels);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const level = await prisma.level.findUnique({
    where: { id },
    include: {
      targets: {
        include: { character: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!level) return res.status(404).send("Not found");
  const characters = level.targets.map((t) => ({
    name: t.character.name,
    slug: t.character.slug,
  }));
  res.json({
    id: level.id,
    title: level.title,
    imageUrl: level.imageUrl,
    characters,
  });
});

module.exports = router;
