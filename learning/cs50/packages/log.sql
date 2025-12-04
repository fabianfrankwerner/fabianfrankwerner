
-- *** The Lost Letter ***

SELECT "type", "address" FROM "addresses" WHERE "address" = '2 Finnegan Street';
-- Nothing Found

SELECT "type", "address" FROM "addresses" WHERE "address" LIKE '%Finnegan Street%';
-- Nothing Found

SELECT "id", "type", "address" FROM "addresses" WHERE "address" = '900 Somerville Avenue';
-- 432 / Residential / 900 Somerville Avenue

SELECT * FROM "packages" WHERE "from_address_id" = 432;
-- 384 / Congratulatory letter / From 432 To 854

SELECT * FROM "addresses" WHERE "id" = 854;
-- 854 / 2 Finnigan Street / Residential

SELECT * FROM "scans" WHERE "package_id" = 384;
-- 384 Dropped at 854 at 023-07-11 23:07:04.432178


-- *** The Devious Delivery ***

SELECT * FROM "packages" WHERE "from_address_id" IS NULL;
-- 5098 / Duck debugger / NULL / 50

SELECT * FROM "scans" WHERE "package_id" = 5098;
-- Dropped of at address_id 348

SELECT * FROM "addresses" WHERE "id" = 348;
-- Police Station


-- *** The Forgotten Gift ***

-- I had sent a mystery gift, you see, to my wonderful granddaughter, off at 728 Maple Place.
-- That was about two weeks ago.
-- Now the delivery date has passed by seven whole days and I hear she still waits.
-- I cannot for the life of me remember what’s inside, but I do know it’s filled to the brim with my love for her.
-- Can we possibly track it down so it can fill her day with joy? I did send it from my home at 109 Tileston Street.

SELECT "id" FROM "addresses" WHERE "address" = '109 Tileston Street';
-- 9873 (Sender)

SELECT "id" FROM "addresses" WHERE "address" = '728 Maple Place';
-- 4983 (Receiver)

SELECT * FROM packages
WHERE from_address_id = (SELECT id FROM addresses WHERE address = '109 Tileston Street')
AND to_address_id = (SELECT id FROM addresses WHERE address = '728 Maple Place');
-- Flowers / 9523 (package_id)

SELECT s.*, d.name AS driver_name
FROM scans s
JOIN drivers d ON s.driver_id = d.id
WHERE s.package_id = 9523
ORDER BY s.timestamp DESC
LIMIT 1;
-- 12432 / 17 (Mikel) / Pick / 2023-08-23 19:41:47.913410

SELECT a.address, a.type
FROM addresses a
JOIN scans s ON a.id = s.address_id
WHERE s.package_id = 9523
AND s.action = 'Drop'
ORDER BY s.timestamp DESC
LIMIT 1;
-- 950 Brannon Harris Way / Warehouse
