require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const levelsRouter = require("./routes/levels");
const sessionsRouter = require("./routes/sessions");
const guessesRouter = require("./routes/guesses");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use("/api/levels", levelsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/guess", guessesRouter);
app.use("/api/leaderboard", leaderboardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`https://localhost:${PORT}`));
