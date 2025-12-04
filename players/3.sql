-- 3.sql: Find the ids of rows where debut value is missing
SELECT "id"
FROM "players"
WHERE "debut" IS NULL;
