require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/levels", levelsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/guess", guessesRouter);
app.use("/api/leaderboard", leaderboardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
