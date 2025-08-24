const bcrypt = require("bcryptjs");
const passport = require("passport");
const { PrismaClient } = require("../generated/prisma");
const LocalStrategy = require("passport-local").Strategy;

const prisma = new PrismaClient();

function indexGet(req, res) {
  try {
    return res.render("index", { user: req.user });
  } catch (e) {
    console.error("Failed to render:", e);
  }
}

function signUpGet(req, res) {
  try {
    return res.render("sign-up-form");
  } catch (e) {
    console.error("Failed to render:", e);
  }
}

async function signUpPost(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });
    res.redirect("/");
  } catch (e) {
    console.error("Failed to sign-up:", e);
  }
}

function logInGet(req, res) {
  try {
    return res.render("log-in-form");
  } catch (e) {
    console.error("Failed to render:", e);
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
        //     email,
        //   ]);
        //   return rows[0];

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

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
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    // return rows[0];

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});

// async function logInPost(req, res, next) {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.render("log-in-form", {
//         title: "Log-In Form",
//         errors: [{ msg: info.message }],
//       });
//     }
//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err);
//       }
//       return res.redirect("/");
//     });
//   })(req, res, next);
// }

// async function logOutGet(req, res, next) {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// }

module.exports = {
  indexGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
};
