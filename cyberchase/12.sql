-- 12.sql: Count the number of unique episode titles
SELECT COUNT(DISTINCT title) AS unique_titles
FROM episodes;
