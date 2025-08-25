const commentController = require("../controllers/commentController");
const { Router } = require("express");

const commentRouter = Router();

commentRouter.get("/", commentController.getAllComments);
commentRouter.get("/:id", commentController.getCommentById);
commentRouter.post("/", commentController.createComment);
commentRouter.put("/:id", commentController.updateComment);
commentRouter.delete("/:id", commentController.deleteComment);

module.exports = commentRouter;
