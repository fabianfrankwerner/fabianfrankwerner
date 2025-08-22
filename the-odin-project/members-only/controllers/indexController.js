const db = require("../db/queries");



// async function getUsernames(req, res) {
//   const usernames = await db.getAllUsernames();
//   console.log("Usernames: ", usernames);
//   res.send("Usernames: " + usernames.map((user) => user.username).join(", "));
// }


async function signUpGet(req, res) {
  res.render("sign-up-form", { title: "Sign-Up Form" });
}

async function signUpPost(req, res) {}

// async function createUsernamePost(req, res) {
//   const { username } = req.body;
//   await db.insertUsername(username);
//   res.redirect("/");
// }

// app.post("/sign-up", async (req, res, next) => {
//     try {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
//         req.body.username,
//         hashedPassword,
//       ]);
//       res.redirect("/");
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   });

module.exports = {
  signUpGet,
  signUpPost,
};
