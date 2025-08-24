const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// async function signUpGet(req, res) {
//   res.render("sign-up-form", { title: "Sign-Up Form" });
// }

// async function signUpPost(req, res, next) {
//   try {
//     await body("first_name")
//       .trim()
//       .escape()
//       .isLength({ min: 1, max: 100 })
//       .withMessage("First name must be between 1 and 100 characters")
//       .isAlpha("en-US", { ignore: " -'" })
//       .withMessage(
//         "First name can only contain letters, spaces, hyphens, and apostrophes"
//       )
//       .run(req);

//     await body("last_name")
//       .trim()
//       .escape()
//       .isLength({ min: 1, max: 100 })
//       .withMessage("Last name must be between 1 and 100 characters")
//       .isAlpha("en-US", { ignore: " -'" })
//       .withMessage(
//         "Last name can only contain letters, spaces, hyphens, and apostrophes"
//       )
//       .run(req);

//     await body("email")
//       .trim()
//       .normalizeEmail()
//       .isEmail()
//       .withMessage("Please enter a valid email address")
//       .isLength({ max: 255 })
//       .withMessage("Email address is too long")
//       .run(req);

//     await body("password")
//       .isLength({ min: 8, max: 255 })
//       .withMessage("Password must be between 8 and 255 characters")
//       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//       .withMessage(
//         "Password must contain at least one lowercase letter, one uppercase letter, and one number"
//       )
//       .run(req);

//     await body("confirm_password")
//       .custom((value, { req }) => {
//         return value === req.body.password;
//       })
//       .withMessage("Password confirmation does not match password")
//       .run(req);

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.render("sign-up-form", {
//         title: "Sign-Up Form",
//         errors: errors.array(),
//         formData: req.body,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     await db.insertUser(
//       req.body.first_name,
//       req.body.last_name,
//       req.body.email,
//       hashedPassword
//     );
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

// async function logInGet(req, res) {
//   res.render("log-in-form", { title: "Log-In Form" });
// }

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         const user = await db.getUserByEmail(email);

//         if (!user) {
//           return done(null, false, { message: "Incorrect email" });
//         }

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//           return done(null, false, { message: "Incorrect password" });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await db.getUserById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

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

// async function upgradePost(req, res, next) {
//   try {
//     const passcode = req.body.upgrade;
//     const user = req.user;

//     if (!user) {
//       return res.redirect("/log-in");
//     }

//     // Secret passcodes
//     const MEMBER_PASSCODE = "1234";
//     const ADMIN_PASSCODE = "9999";

//     let newStatus = null;

//     if (passcode === MEMBER_PASSCODE) {
//       // Guest can become member
//       if (user.membership_status === "GUEST") {
//         newStatus = "MEMBER";
//       }
//     } else if (passcode === ADMIN_PASSCODE) {
//       // Guest or member can become admin
//       if (
//         user.membership_status === "GUEST" ||
//         user.membership_status === "MEMBER"
//       ) {
//         newStatus = "ADMIN";
//       }
//     }

//     if (newStatus) {
//       await db.updateMembershipStatus(user.id, newStatus);
//       // Update the user object in session
//       user.membership_status = newStatus;
//       res.redirect("/");
//     } else {
//       // Invalid passcode or downgrade attempt
//       res.redirect("/");
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

// async function indexGet(req, res) {
//   try {
//     const messages = await db.getAllMessages();
//     res.render("index", { user: req.user, messages });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

// async function createMessagePost(req, res, next) {
//   try {
//     const { title, body } = req.body;
//     const user = req.user;

//     if (!user) {
//       return res.redirect("/log-in");
//     }

//     // Only members and admins can create messages
//     if (
//       user.membership_status !== "MEMBER" &&
//       user.membership_status !== "ADMIN"
//     ) {
//       return res.redirect("/");
//     }

//     await db.createMessage(title, body, user.id);
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

// async function deleteMessagePost(req, res, next) {
//   try {
//     const messageId = req.params.id;
//     const user = req.user;

//     if (!user) {
//       return res.redirect("/log-in");
//     }

//     // Only admins can delete messages
//     if (user.membership_status !== "ADMIN") {
//       return res.redirect("/");
//     }

//     await db.deleteMessage(messageId);
//     res.redirect("/");
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// }

// module.exports = {
//   signUpGet,
//   signUpPost,
//   logInGet,
//   logInPost,
//   logOutGet,
//   upgradePost,
//   indexGet,
//   createMessagePost,
//   deleteMessagePost,
// };
