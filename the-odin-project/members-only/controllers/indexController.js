const db = require("../db/queries");
// secure the passwords with bcrypt
const bcrypt = require("bcryptjs");
// sanitize and validate the form fields
// validate confirmPassword field using a custom validator.

async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign-Up Form" });
}

async function signUpPost(req, res, next) {
  //   try {
  //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
  //     await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
  //       req.body.username,
  //       hashedPassword,
  //     ]);
  //     res.redirect("/");
  //   } catch (error) {
  //     console.error(error);
  //     next(error);
  //   }
}

module.exports = {
  signUpGet,
  signUpPost,
};
