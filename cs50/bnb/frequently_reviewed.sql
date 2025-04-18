CREATE VIEW frequently_reviewed AS
SELECT l.id, l.property_type, l.host_name, COUNT(r.id) AS reviews
FROM listings l
JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id
ORDER BY reviews DESC, property_type ASC, host_name ASC
LIMIT 100;
