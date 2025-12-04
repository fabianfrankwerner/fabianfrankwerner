-----------------------------------------------------------
-- Query 1: Search for movies by title (partial match)
-----------------------------------------------------------
SELECT movie_id, title, release_date
FROM movies
WHERE title LIKE '%Inception%';

-----------------------------------------------------------
-- Query 2: Retrieve complete movie information
-----------------------------------------------------------
SELECT *
FROM MovieCompleteInfo
WHERE movie_id = 1;

-----------------------------------------------------------
-- Query 3: List movies released in a given year with average ratings
-----------------------------------------------------------
SELECT m.movie_id, m.title, m.release_date, ar.avg_user_rating, ar.avg_critic_rating
FROM movies m
JOIN AggregatedRatings ar ON m.movie_id = ar.movie_id
WHERE strftime('%Y', m.release_date) = '2010'
ORDER BY m.release_date;

-----------------------------------------------------------
-- Query 4: Insert a new user review
-----------------------------------------------------------
INSERT INTO user_reviews (user_id, movie_id, rating, review_text)
VALUES (1, 2, 8, 'Great plot and outstanding performances.');

-----------------------------------------------------------
-- Query 5: Update an existing user review
-----------------------------------------------------------
UPDATE user_reviews
SET rating = 9,
    review_text = 'Upon a second viewing, the film grows even more impressive.'
WHERE review_id = 1;

-----------------------------------------------------------
-- Query 6: Delete a user review
-----------------------------------------------------------
DELETE FROM user_reviews
WHERE review_id = 1;

-----------------------------------------------------------
-- Query 7: Add a movie to a user's watchlist
-----------------------------------------------------------
INSERT INTO user_watchlists (user_id, movie_id)
VALUES (1, 3);

-----------------------------------------------------------
-- Query 8: Retrieve all movies in a user's watchlist with watch status
-----------------------------------------------------------
SELECT u.user_id, m.movie_id, m.title, uw.date_added, uw.watched
FROM user_watchlists uw
JOIN movies m ON uw.movie_id = m.movie_id
JOIN users u ON uw.user_id = u.user_id
WHERE u.user_id = 1;

-----------------------------------------------------------
-- Query 9: Retrieve all reviews (user and critic) for a movie
-----------------------------------------------------------
SELECT 'user' AS review_type, ur.review_id, u.username, ur.rating, ur.review_text, ur.review_date
FROM user_reviews ur
JOIN users u ON ur.user_id = u.user_id
WHERE ur.movie_id = 1
UNION
SELECT 'critic' AS review_type, cr.review_id, c.name, cr.rating, cr.review_text, cr.review_date
FROM critic_reviews cr
JOIN critics c ON cr.critic_id = c.critic_id
WHERE cr.movie_id = 1
ORDER BY review_date DESC;

-----------------------------------------------------------
-- Query 10: Retrieve filmography for a given director
-----------------------------------------------------------
SELECT m.movie_id, m.title, mc.role
FROM movie_crew mc
JOIN movies m ON mc.movie_id = m.movie_id
WHERE mc.person_id = (
    SELECT person_id FROM people WHERE name = 'Christopher Nolan'
) AND mc.role = 'director';
