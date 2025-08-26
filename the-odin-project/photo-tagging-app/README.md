# Photo Tagging App

## Assignment

- [ ] Choose a photo and decide on characters to find (e.g. Waldo, Wizard, Wilma).
- [ ] Record exact pixel coordinates for each character and save them to your database.

- [ ] Set up project structure:

  - [ ] Initialize backend with Express and Prisma (PostgreSQL as DB).
  - [ ] Initialize frontend with Vite + React (JSX).

- [ ] Backend tasks:

  - [ ] Define Prisma models for `Photo`, `Character`, `Game`, `Score`.
  - [ ] Run `prisma migrate dev` to create database schema.
  - [ ] Implement API routes:
    - [ ] `GET /photos` → list available photos.
    - [ ] `GET /photos/:id/characters` → list characters for a photo.
    - [ ] `POST /validate` → validate click position against character coordinates.
    - [ ] `POST /scores` → save player name + score.
    - [ ] `GET /scores/:photoId` → fetch leaderboard for a photo.
  - [ ] Add seed script to insert photo(s) and character positions.

- [ ] Frontend tasks:

  - [ ] Display photo on screen.
  - [ ] Capture user click coordinates on the photo.
  - [ ] Show targeting box at click position with dropdown menu of characters.
  - [ ] Remove targeting box when user clicks away.
  - [ ] On character selection:
    - [ ] Send coordinates + chosen character to backend for validation.
    - [ ] If correct → place permanent marker on character.
    - [ ] If wrong → show error message.
  - [ ] Prevent selecting the same character twice.

- [ ] Timer functionality:

  - [ ] Start timer when photo loads.
  - [ ] Stop timer when all characters are found.
  - [ ] Send final score (time + name) to backend.

- [ ] High score functionality:
  - [ ] Show popup asking for player’s name after game completion.
  - [ ] Display leaderboard with top scores.

## Extra Credit

- [ ] Support multiple photos in database.
- [ ] Add photo selection screen before starting the game.
- [ ] Style the app with custom CSS for better UX.
