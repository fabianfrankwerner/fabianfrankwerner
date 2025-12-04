const postController = require("../controllers/postController");
const {
  authenticateToken,
  requireAuthor,
  requirePostOwnership,
} = require("../middleware/auth");
const { Router } = require("express");

const postRouter = Router();

// Public routes (no authentication required)
postRouter.get("/published", postController.getPublishedPosts);

// Protected routes (authentication required)
postRouter.get(
  "/",
  authenticateToken,
  requireAuthor,
  postController.getAllPosts
);
postRouter.post(
  "/",
  authenticateToken,
  requireAuthor,
  postController.createPost
);

// Parameterized routes (must come after specific routes)
postRouter.get("/:id", postController.getPostById);
postRouter.put(
  "/:id",
  authenticateToken,
  requirePostOwnership,
  postController.updatePost
);
postRouter.delete(
  "/:id",
  authenticateToken,
  requirePostOwnership,
  postController.deletePost
);
postRouter.patch(
  "/:id/publish",
  authenticateToken,
  requirePostOwnership,
  postController.publishPost
);
postRouter.patch(
  "/:id/unpublish",
  authenticateToken,
  requirePostOwnership,
  postController.unpublishPost
);

module.exports = postRouter;
