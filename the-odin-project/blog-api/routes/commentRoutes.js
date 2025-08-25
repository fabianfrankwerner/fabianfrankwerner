const commentController = require("../controllers/commentController");
const {
  authenticateToken,
  requireCommentOwnership,
} = require("../middleware/auth");
const { Router } = require("express");

const commentRouter = Router();

// Public routes (no authentication required)
commentRouter.get("/", commentController.getAllComments);
commentRouter.get("/:id", commentController.getCommentById);

// Protected routes (authentication required)
commentRouter.post("/", authenticateToken, commentController.createComment);
commentRouter.put(
  "/:id",
  authenticateToken,
  requireCommentOwnership,
  commentController.updateComment
);
commentRouter.delete(
  "/:id",
  authenticateToken,
  requireCommentOwnership,
  commentController.deleteComment
);

module.exports = commentRouter;
