const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

const requireAuthor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "AUTHOR") {
    return res.status(403).json({ error: "Author role required" });
  }

  next();
};

const requireAuthOrAuthor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Allow if user is AUTHOR or if they're the owner of the resource
  if (req.user.role === "AUTHOR") {
    return next();
  }

  // For other operations, check if user owns the resource
  // This will be handled in individual controllers
  next();
};

const requirePostOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== userId && req.user.role !== "AUTHOR") {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this post" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requireCommentOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId && req.user.role !== "AUTHOR") {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this comment" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  authenticateToken,
  requireAuthor,
  requireAuthOrAuthor,
  requirePostOwnership,
  requireCommentOwnership,
};
