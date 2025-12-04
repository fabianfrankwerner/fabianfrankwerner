-- 13.sql: Custom query with at least one condition using WHERE with AND or OR
SELECT title, topic, season, air_date
FROM episodes
WHERE (topic LIKE '%pattern%' OR topic LIKE '%probability%') AND season <= 5
ORDER BY air_date;
