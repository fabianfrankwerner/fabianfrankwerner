const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../db/pool");

async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign-Up Form" });
}

async function signUpPost(req, res, next) {
  try {
    await body("first_name")
      .trim()
      .escape()
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters")
      .isAlpha("en-US", { ignore: " -'" })
      .withMessage(
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .run(req);

    await body("last_name")
      .trim()
      .escape()
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters")
      .isAlpha("en-US", { ignore: " -'" })
      .withMessage(
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      )
      .run(req);

    await body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .isLength({ max: 255 })
      .withMessage("Email address is too long")
      .run(req);

    await body("password")
      .isLength({ min: 8, max: 255 })
      .withMessage("Password must be between 8 and 255 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      )
      .run(req);

    await body("confirm_password")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Password confirmation does not match password")
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("sign-up-form", {
        title: "Sign-Up Form",
        errors: errors.array(),
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.insertUser(
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      hashedPassword
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function logInGet(req, res) {
  res.render("log-in-form", { title: "Log-In Form" });
}

// refactor to query

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

async function logInPost() {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  });
}

module.exports = {
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
};
