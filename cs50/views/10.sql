SELECT "artist" AS "Artist", "english_title" AS "Title", "entropy" AS "Complexity Score" FROM "views" WHERE "entropy" > (SELECT AVG("entropy") FROM "views") ORDER BY "contrast" DESC;
