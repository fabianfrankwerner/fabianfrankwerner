const db = require("../db/queries");
const bcrypt = require("bcryptjs");
// sanitize and validate the form fields
const { body, validationResult } = require("express-validator");

// const alphaErr = "must only contain letters.";
// const lengthErr = "must be between 1 and 10 characters.";

// const validateUser = [
//   body("first_name")
//     .trim()
//     .isAlpha()
//     .withMessage(`First name ${alphaErr}`)
//     .isLength({ min: 1, max: 10 })
//     .withMessage(`First name ${lengthErr}`),
//   body("last_name")
//     .trim()
//     .isAlpha()
//     .withMessage(`Last name ${alphaErr}`)
//     .isLength({ min: 1, max: 10 })
//     .withMessage(`Last name ${lengthErr}`),
// ];

async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign-Up Form" });
}

async function signUpPost(req, res, next) {
  try {
    await body("password").isLength({ min: 5 }).run(req);
    await body("confirm_password")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
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

module.exports = {
  signUpGet,
  signUpPost,
};
