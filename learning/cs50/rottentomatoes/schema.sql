-----------------------------------------------------------
-- Tables to construct the database
-----------------------------------------------------------

-- Create Movies table
CREATE TABLE movies (
    movie_id      INTEGER PRIMARY KEY,
    title         TEXT NOT NULL,
    release_date  DATE,
    runtime       INTEGER,
    plot_summary  TEXT,
    mpaa_rating   TEXT,
    poster_url    TEXT,
    box_office    NUMERIC,
    language      TEXT,
    country       TEXT
);

-- Create People table (for actors, directors, writers, etc.)
CREATE TABLE people (
    person_id     INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    birth_date    DATE,
    bio           TEXT,
    photo_url     TEXT,
    nationality   TEXT
);

-- Create Genres table
CREATE TABLE genres (
    genre_id      INTEGER PRIMARY KEY,
    name          TEXT NOT NULL UNIQUE
);

-- Create Production Companies table
CREATE TABLE production_companies (
    company_id    INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    founding_date DATE,
    headquarters  TEXT,
    logo_url      TEXT
);

-- Create Users table
CREATE TABLE users (
    user_id       INTEGER PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    join_date     DATE DEFAULT (date('now')),
    is_active     BOOLEAN DEFAULT TRUE
);

-- Create Critics table
CREATE TABLE critics (
    critic_id     INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    publication   TEXT,
    verified      BOOLEAN DEFAULT FALSE
);

-- Create User Reviews table
CREATE TABLE user_reviews (
    review_id    INTEGER PRIMARY KEY,
    user_id      INTEGER,
    movie_id     INTEGER,
    rating       INTEGER CHECK (rating BETWEEN 1 AND 10),
    review_text  TEXT,
    review_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
);

-- Create Critic Reviews table
CREATE TABLE critic_reviews (
    review_id    INTEGER PRIMARY KEY,
    critic_id    INTEGER,
    movie_id     INTEGER,
    rating       INTEGER CHECK (rating BETWEEN 1 AND 100),
    review_text  TEXT,
    review_date  DATETIME DEFAULT CURRENT_TIMESTAMP,
    url          TEXT,
    FOREIGN KEY(critic_id) REFERENCES critics(critic_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
);

-- Create Collections table
CREATE TABLE collections (
    collection_id INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    description   TEXT
);

-- Create Awards table
CREATE TABLE awards (
    award_id      INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    category      TEXT NOT NULL,
    year          INTEGER NOT NULL
);

-- Many-to-Many: Movie_Genres
CREATE TABLE movie_genres (
    movie_id  INTEGER,
    genre_id  INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY(genre_id) REFERENCES genres(genre_id)
);

-- Many-to-Many: Movie_Cast (including character details)
CREATE TABLE movie_cast (
    movie_id       INTEGER,
    person_id      INTEGER,
    character_name TEXT,
    role_type      TEXT,  -- e.g., lead, supporting, cameo
    PRIMARY KEY (movie_id, person_id, character_name),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY(person_id) REFERENCES people(person_id)
);

-- Many-to-Many: Movie_Crew (for directors, writers, etc.)
CREATE TABLE movie_crew (
    movie_id  INTEGER,
    person_id INTEGER,
    role      TEXT NOT NULL, -- e.g., director, writer
    PRIMARY KEY (movie_id, person_id, role),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY(person_id) REFERENCES people(person_id)
);

-- Many-to-Many: Movie_Production_Companies
CREATE TABLE movie_production_companies (
    movie_id   INTEGER,
    company_id INTEGER,
    role       TEXT, -- e.g., producer, distributor
    PRIMARY KEY (movie_id, company_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY(company_id) REFERENCES production_companies(company_id)
);

-- Many-to-Many: Movie_Awards (with optional person association)
CREATE TABLE movie_awards (
    movie_id  INTEGER,
    award_id  INTEGER,
    person_id INTEGER, -- if applicable (for individual awards)
    won       BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (movie_id, award_id, person_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY(award_id) REFERENCES awards(award_id),
    FOREIGN KEY(person_id) REFERENCES people(person_id)
);

-- Many-to-Many: Collection_Movies
CREATE TABLE collection_movies (
    collection_id     INTEGER,
    movie_id          INTEGER,
    order_in_collection INTEGER,
    PRIMARY KEY (collection_id, movie_id),
    FOREIGN KEY(collection_id) REFERENCES collections(collection_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
);

-- Many-to-Many: User_Watchlists
CREATE TABLE user_watchlists (
    user_id    INTEGER,
    movie_id   INTEGER,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    watched    BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(movie_id) REFERENCES movies(movie_id)
);

-----------------------------------------------------------
-- Indexes to optimize common queries
-----------------------------------------------------------

-- Index on movies title for fast search
CREATE INDEX idx_movies_title ON movies(title);

-- Index on movies release_date for filtering
CREATE INDEX idx_movies_release_date ON movies(release_date);

-- Composite index on movies language and country for regional filtering
CREATE INDEX idx_movies_language_country ON movies(language, country);

-- Index on people name for quick lookups
CREATE INDEX idx_people_name ON people(name);

-- Index on user_reviews movie_id for fast aggregation
CREATE INDEX idx_user_reviews_movie ON user_reviews(movie_id);

-- Index on critic_reviews movie_id for fast aggregation
CREATE INDEX idx_critic_reviews_movie ON critic_reviews(movie_id);

-----------------------------------------------------------
-- Views to provide aggregated information
-----------------------------------------------------------

-- View: AggregatedRatings - Combines average ratings from user and critic reviews
CREATE VIEW AggregatedRatings AS
SELECT
    m.movie_id,
    m.title,
    ROUND(AVG(ur.rating), 2) AS avg_user_rating,
    ROUND(AVG(cr.rating)/10.0, 2) AS avg_critic_rating  -- scale critic ratings to 1-10
FROM movies m
LEFT JOIN user_reviews ur ON m.movie_id = ur.movie_id
LEFT JOIN critic_reviews cr ON m.movie_id = cr.movie_id
GROUP BY m.movie_id;

-- View: MovieCompleteInfo - Joins movie details with genres and top cast
CREATE VIEW MovieCompleteInfo AS
SELECT
    m.movie_id,
    m.title,
    m.release_date,
    GROUP_CONCAT(DISTINCT g.name) AS genres,
    GROUP_CONCAT(DISTINCT p.name) AS top_cast
FROM movies m
LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
LEFT JOIN genres g ON mg.genre_id = g.genre_id
LEFT JOIN movie_cast mc ON m.movie_id = mc.movie_id
LEFT JOIN people p ON mc.person_id = p.person_id
GROUP BY m.movie_id;
