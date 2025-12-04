# Design Document

By Fabian Frank Werner

Video overview: [Rotten Tomatoes Clone](https://www.youtube.com/watch?v=31atLPtz2MU)

---

## Scope

### Purpose of the Database
The purpose of this database is to create a comprehensive system for cataloging, rating, and discovering movies – similar in spirit to Rotten Tomatoes. It is intended to serve both casual movie enthusiasts and serious film critics by storing detailed information about movies, people involved in filmmaking, reviews, and related metadata. The system aims to enable users to search for films based on multiple criteria, view detailed movie profiles, and contribute ratings and reviews.

### Within Scope
The database includes the following:
- **Movies:** Detailed records for each film (title, release date, runtime, plot summary, genre, rating, etc.).
- **People:** Information about directors, actors, writers, and other film professionals.
- **Genres:** Categories that classify movies.
- **Production Companies:** Data regarding studios and companies involved in the production.
- **User Profiles:** User accounts that can post ratings and reviews.
- **Critic Profiles:** Verified critic accounts with professional reviews.
- **Reviews:** Both user reviews and critic reviews.
- **Collections:** Groupings of movies such as franchises or curated lists.
- **Awards:** Information about awards and nominations associated with movies.
- **Watchlists:** Users’ personal lists to track movies they want to see.

### Outside Scope
The database does not include:
- Actual streaming or video content storage.
- Ticket purchasing or real-time box office financial details beyond summary figures.
- Detailed behind-the-scenes production data.
- Fan fiction, unofficial content, or non-film media such as TV shows or music.

---

## Functional Requirements

### What Users Should Be Able to Do
- **Search:** Find movies by title, genre, cast, release year, language, etc.
- **View Details:** Access comprehensive movie profiles including cast, crew, reviews, and awards.
- **Review:** Submit ratings and reviews for movies.
- **Discover:** Browse filmographies for actors, directors, and see aggregated ratings from both critics and users.
- **Manage Watchlists:** Create and update personal lists of movies to watch.
- **Compare Movies:** Evaluate movies side-by-side based on key metrics (ratings, reviews, release date).
- **Explore Collections:** Browse curated collections or franchises.

### What Is Beyond Scope
- Streaming or downloading the actual movie content.
- Purchasing tickets or managing showtimes.
- Allowing unverified edits to official movie information.
- Accessing in-depth financial records or production contracts.

---

## Representation

### Entities

1. **Movies**
   - **Attributes:**
     - `movie_id` (INTEGER): Unique identifier
     - `title` (TEXT): Movie title, NOT NULL
     - `release_date` (DATE): Official release date
     - `runtime` (INTEGER): Duration in minutes
     - `plot_summary` (TEXT): A brief description
     - `mpaa_rating` (TEXT): Content rating (e.g., G, PG, PG-13)
     - `poster_url` (TEXT): URL for the movie poster
     - `box_office` (NUMERIC): Earnings in USD
     - `language` (TEXT): Primary language
     - `country` (TEXT): Country of origin

2. **People**
   - **Attributes:**
     - `person_id` (INTEGER): Unique identifier
     - `name` (TEXT): Full name, NOT NULL
     - `birth_date` (DATE): Date of birth
     - `bio` (TEXT): Biographical details
     - `photo_url` (TEXT): URL to photo
     - `nationality` (TEXT): Nationality

3. **Genres**
   - **Attributes:**
     - `genre_id` (INTEGER): Unique identifier
     - `name` (TEXT): Genre name, NOT NULL, UNIQUE

4. **Production Companies**
   - **Attributes:**
     - `company_id` (INTEGER): Unique identifier
     - `name` (TEXT): Company name, NOT NULL
     - `founding_date` (DATE): Date founded
     - `headquarters` (TEXT): Location of HQ
     - `logo_url` (TEXT): URL for company logo

5. **Users**
   - **Attributes:**
     - `user_id` (INTEGER): Unique identifier
     - `username` (TEXT): Username, NOT NULL, UNIQUE
     - `email` (TEXT): Email address, NOT NULL, UNIQUE
     - `password_hash` (TEXT): Securely stored password, NOT NULL
     - `join_date` (DATE): Date joined (default current date)
     - `is_active` (BOOLEAN): Account status (default TRUE)

6. **Critics**
   - **Attributes:**
     - `critic_id` (INTEGER): Unique identifier
     - `name` (TEXT): Critic’s name, NOT NULL
     - `publication` (TEXT): Associated publication
     - `verified` (BOOLEAN): Verification status (default FALSE)

7. **User Reviews**
   - **Attributes:**
     - `review_id` (INTEGER): Unique identifier
     - `user_id` (INTEGER): Foreign key to Users
     - `movie_id` (INTEGER): Foreign key to Movies
     - `rating` (INTEGER): Rating (1-10) with a CHECK constraint
     - `review_text` (TEXT): Text of the review
     - `review_date` (DATETIME): Submission date (default CURRENT_TIMESTAMP)

8. **Critic Reviews**
   - **Attributes:**
     - `review_id` (INTEGER): Unique identifier
     - `critic_id` (INTEGER): Foreign key to Critics
     - `movie_id` (INTEGER): Foreign key to Movies
     - `rating` (INTEGER): Rating (1-100) with a CHECK constraint
     - `review_text` (TEXT): Text of the review
     - `review_date` (DATETIME): Submission date (default CURRENT_TIMESTAMP)
     - `url` (TEXT): Link to the full review

9. **Collections**
   - **Attributes:**
     - `collection_id` (INTEGER): Unique identifier
     - `name` (TEXT): Collection name, NOT NULL
     - `description` (TEXT): Description

10. **Awards**
    - **Attributes:**
      - `award_id` (INTEGER): Unique identifier
      - `name` (TEXT): Award name, NOT NULL
      - `category` (TEXT): Award category, NOT NULL
      - `year` (INTEGER): Year awarded, NOT NULL

### Relationships
The design includes several many-to-many relationships:

- **Movie_Genres:** Associates movies with one or more genres.
- **Movie_Cast:** Links movies to people playing characters, including role details.
- **Movie_Crew:** Links movies to crew members (e.g., director, writer).
- **Movie_Production_Companies:** Connects movies with companies (producer, distributor roles).
- **Movie_Awards:** Relates movies to awards (with an optional person reference).
- **Collection_Movies:** Associates movies with collections, maintaining order.
- **User_Watchlists:** Allows users to create personal watchlists for movies.

![ERD](diagram.png)

---

## Optimizations

### Indexes

**Movie Search Indexes:**
- An index on `movies(title)` to speed up title-based searches.
- An index on `movies(release_date)` for efficient filtering by release date.
- A composite index on `movies(language, country)` for regional queries.

**Person Indexes:**
- An index on `people(name)` to quickly locate film professionals.

**Review Indexes:**
- Indexes on `user_reviews(movie_id)` and `critic_reviews(movie_id)` to accelerate retrieval of reviews.
- An index on `user_reviews(user_id)` for fetching a user’s review history.

### Views

**AggregatedRatings:**
A view that joins user and critic reviews to calculate average ratings for each movie.

**MovieCompleteInfo:**
A view that combines movie details, genres, and top cast and crew information for comprehensive profiles.

These optimizations aim to support fast query responses for common operations like search, detail view, and user review aggregation.

---

## Limitations

### Design Limitations

**Language and International Support:**
The design is primarily oriented toward English-language content, which may not fully capture international titles or non-Latin character sets.

**Rating Granularity:**
The current user rating (1–10) and critic rating (1–100) scales are relatively simplistic. They may not capture the nuances of detailed film criticism.

**Temporal Data:**
The schema does not account for multiple editions of films (e.g., director’s cuts or extended editions) and is limited to a single record per movie.

**Complex Relationships:**
While the design covers many-to-many relationships, it simplifies relationships like remakes, inspirations, or sequels beyond collection membership.

**Multimedia Integration:**
There is no support for storing or managing multimedia content (trailers, behind-the-scenes clips, etc.) within the database.
