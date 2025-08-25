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
        folders: {
          create: [
            {
              name: "Default Folder",
            },
          ],
        },
      },
    });
    res.redirect("/log-in");
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

async function logInPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("log-in-form", {
        errors: [{ msg: info.message }],
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/folders");
    });
  })(req, res, next);
}

async function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function foldersGet(req, res) {
  try {
    // Fetch all folders for the authenticated user, sorted by creation date (newest first)
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            size: true,
            mimeType: true,
            createdAt: true,
          },
        },
      },
    });

    return res.render("folders", {
      user: req.user,
      folders: folders,
    });
  } catch (e) {
    console.error("Failed to render folders:", e);
    return res.status(500).render("folders", {
      user: req.user,
      folders: [],
      error: "Failed to load folders",
    });
  }
}

async function foldersPost(req, res) {
  try {
    // Validate input
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.render("folders", {
        user: req.user,
        folders: [],
        error: "Folder name is required",
      });
    }

    // Create new folder for the authenticated user
    await prisma.folder.create({
      data: {
        name: name.trim(),
        userId: req.user.id,
      },
    });

    res.redirect("/folders");
  } catch (e) {
    console.error("Failed to create folder:", e);
    return res.render("folders", {
      user: req.user,
      folders: [],
      error: "Failed to create folder",
    });
  }
}

async function folderGet(req, res) {
  try {
    const id = req.params.folderId;

    // Fetch the specific folder with its files for the authenticated user
    const folder = await prisma.folder.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            size: true,
            mimeType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!folder) {
      return res.status(404).render("folder", {
        user: req.user,
        error: "Folder not found",
      });
    }

    return res.render("folder", {
      user: req.user,
      folder: folder,
    });
  } catch (e) {
    console.error("Failed to render folder:", e);
    return res.status(500).render("folder", {
      user: req.user,
      error: "Failed to load folder",
    });
  }
}

async function folderRenamePost(req, res) {
  try {
    const id = req.params.folderId;
    const { name } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    // Check if folder exists and belongs to the user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Update the folder name
    await prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        name: name.trim(),
      },
    });

    res.json({ success: true, name: name.trim() });
  } catch (e) {
    console.error("Failed to rename folder:", e);
    res.status(500).json({ error: "Failed to rename folder" });
  }
}

async function folderDeletePost(req, res) {
  try {
    const id = req.params.folderId;

    // Check if folder exists and belongs to the user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
      include: {
        files: true,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Delete the folder (this will cascade delete all files in the folder)
    await prisma.folder.delete({
      where: {
        id: id,
      },
    });

    res.json({ success: true });
  } catch (e) {
    console.error("Failed to delete folder:", e);
    res.status(500).json({ error: "Failed to delete folder" });
  }
}

module.exports = {
  indexGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutGet,
  foldersGet,
  foldersPost,
  folderGet,
  folderRenamePost,
  folderDeletePost,
};
