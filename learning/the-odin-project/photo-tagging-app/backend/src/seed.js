const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const level = await prisma.level.create({
    data: {
      title: "PXL CON",
      imageUrl:
        "https://preview.redd.it/17j8zvnwqw211.jpg?auto=webp&s=253f7b7151ff615b3ac353e6351f7cffcc4cd126",
      naturalWidth: 3600,
      naturalHeight: 2544,
    },
  });

  const waldo = await prisma.character.create({
    data: { name: "Waldo", slug: "waldo" },
  });
  const pacman = await prisma.character.create({
    data: { name: "Pacman", slug: "pacman" },
  });
  const finn = await prisma.character.create({
    data: { name: "Finn", slug: "finn" },
  });

  await prisma.target.create({
    data: {
      levelId: level.id,
      characterId: waldo.id,
      xMin: 2150 / level.naturalWidth,
      yMin: 600 / level.naturalHeight,
      xMax: (2150 + 50) / level.naturalWidth,
      yMax: (600 + 50) / level.naturalHeight,
    },
  });
  await prisma.target.create({
    data: {
      levelId: level.id,
      characterId: pacman.id,
      xMin: 2700 / level.naturalWidth,
      yMin: 2060 / level.naturalHeight,
      xMax: (2700 + 50) / level.naturalWidth,
      yMax: (2060 + 50) / level.naturalHeight,
    },
  });
  await prisma.target.create({
    data: {
      levelId: level.id,
      characterId: finn.id,
      xMin: 375 / level.naturalWidth,
      yMin: 2425 / level.naturalHeight,
      xMax: (375 + 50) / level.naturalWidth,
      yMax: (2425 + 50) / level.naturalHeight,
    },
  });

  console.log("✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
