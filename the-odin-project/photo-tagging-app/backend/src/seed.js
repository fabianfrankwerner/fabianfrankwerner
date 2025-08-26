const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const level = await prisma.level.create({
    data: {
      title: "Convention Level",
      imageUrl:
        "https://preview.redd.it/17j8zvnwqw211.jpg?auto=webp&s=253f7b7151ff615b3ac353e6351f7cffcc4cd126",
      naturalWidth: 3600,
      naturalHeight: 2544,
      targets: {
        create: [
          // you can create characters separately and reference them; this is simplest
        ],
      },
    },
  });

  const waldo = await prisma.character.create({
    data: { name: "Waldo", slug: "waldo" },
  });
  const wizard = await prisma.character.create({
    data: { name: "Wizard", slug: "wizard" },
  });

  // 2150 / 600

  // Example target: a 50x50 px box at (left: 400, top: 200)
  await prisma.target.create({
    data: {
      levelId: level.id,
      characterId: waldo.id,
      xMin: 400 / level.naturalWidth,
      yMin: 200 / level.naturalHeight,
      xMax: (400 + 50) / level.naturalWidth,
      yMax: (200 + 50) / level.naturalHeight,
    },
  });

  // ... create other targets similarly
  console.log("Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
