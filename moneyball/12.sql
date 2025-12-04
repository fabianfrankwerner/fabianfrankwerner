WITH "cheap_hits" AS (
    SELECT
        "players"."id"
    FROM "players"
    JOIN "salaries" ON "players"."id" = "salaries"."player_id"
    JOIN "performances" ON "players"."id" = "performances"."player_id" AND "salaries"."year" = "performances"."year"
    WHERE "salaries"."year" = 2001 AND "performances"."H" > 0
    ORDER BY "salaries"."salary" / "performances"."H" ASC
    LIMIT 10
),
"cheap_rbis" AS (
    SELECT
        "players"."id"
    FROM "players"
    JOIN "salaries" ON "players"."id" = "salaries"."player_id"
    JOIN "performances" ON "players"."id" = "performances"."player_id" AND "salaries"."year" = "performances"."year"
    WHERE "salaries"."year" = 2001 AND "performances"."RBI" > 0
    ORDER BY "salaries"."salary" / "performances"."RBI" ASC
    LIMIT 10
)
SELECT
    "players"."first_name",
    "players"."last_name"
FROM "players"
WHERE "players"."id" IN (SELECT "id" FROM "cheap_hits")
AND "players"."id" IN (SELECT "id" FROM "cheap_rbis")
ORDER BY "players"."id" ASC;
