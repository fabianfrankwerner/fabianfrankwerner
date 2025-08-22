const path = require("node:path");
const express = require("express");
const indexRouter = require("./routes/indexRouter");

// const passport = require("passport");
// const session = require("express-session");
// const LocalStrategy = require("passport-local").Strategy;

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
// app.use(express.urlencoded({ extended: false }));
// app.use(passport.session());

app.use("/", indexRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port http://localhost:3000`);
});
