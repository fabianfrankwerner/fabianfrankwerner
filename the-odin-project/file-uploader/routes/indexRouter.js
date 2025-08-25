const { Router } = require("express");
const indexController = require("../controllers/indexController");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

const indexRouter = Router();

// Configure multer storage
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

const upload = multer({ storage });

indexRouter.get("/", indexController.indexGet);
indexRouter.get("/sign-up", indexController.signUpGet);
indexRouter.post("/sign-up", indexController.signUpPost);
indexRouter.get("/log-in", indexController.logInGet);
indexRouter.post("/log-in", indexController.logInPost);
indexRouter.get("/log-out", indexController.logOutGet);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}

indexRouter.get("/folders", ensureAuthenticated, indexController.foldersGet);
indexRouter.post("/folders", ensureAuthenticated, indexController.foldersPost);
indexRouter.get(
  "/folders/:folderId",
  ensureAuthenticated,
  indexController.folderGet
);
indexRouter.post(
  "/folders/:folderId/rename",
  ensureAuthenticated,
  indexController.folderRenamePost
);
indexRouter.post(
  "/folders/:folderId/delete",
  ensureAuthenticated,
  indexController.folderDeletePost
);

// Upload a file to a folder
indexRouter.post(
  "/folders/:folderId/files",
  ensureAuthenticated,
  upload.single("file"),
  indexController.fileUploadPost
);

module.exports = indexRouter;
