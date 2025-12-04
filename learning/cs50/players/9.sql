-- 9.sql: Find players who played their final game in 2022
SELECT "first_name", "last_name"
FROM "players"
WHERE "final_game" LIKE '2022%'
ORDER BY "first_name", "last_name";
