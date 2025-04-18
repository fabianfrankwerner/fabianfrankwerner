-- 5.sql: Return first and last names of all right-handed batters
SELECT "first_name", "last_name"
FROM "players"
WHERE "bats" = 'R'
ORDER BY "first_name", "last_name";
