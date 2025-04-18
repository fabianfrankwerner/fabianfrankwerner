-- 10.sql: Custom query - Find tallest players born outside the USA who debuted after 2010
SELECT "first_name" AS "First Name", "last_name" AS "Last Name", "height" AS "Height (inches)", "birth_country" AS "Country"
FROM "players"
WHERE "birth_country" != 'USA' AND "debut" >= '2010-01-01'
ORDER BY "height" DESC
LIMIT 10;
