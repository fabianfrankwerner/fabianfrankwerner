SELECT "salary"
FROM "players"
JOIN "performances" ON "players"."id" = "performances"."player_id"
JOIN "salaries" ON "players"."id" = "salaries"."player_id" AND "performances"."year" = "salaries"."year"
WHERE "performances"."year" = 2001
ORDER BY "performances"."HR" DESC
LIMIT 1;
