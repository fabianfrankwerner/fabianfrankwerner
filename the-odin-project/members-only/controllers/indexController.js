const db = require("../db/queries");
const bcrypt = require("bcryptjs");
// sanitize and validate the form fields
// validate confirmPassword field using a custom validator.

async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign-Up Form" });
}

async function signUpPost(req, res, next) {
  try {
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
