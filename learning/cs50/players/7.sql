-- 7.sql: Count players who bat right-handed and throw left-handed, or vice versa
SELECT COUNT(*) AS count
FROM "players"
WHERE ("bats" = 'R' AND "throws" = 'L') OR ("bats" = 'L' AND "throws" = 'R');
