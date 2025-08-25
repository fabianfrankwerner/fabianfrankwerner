const postController = require("../controllers/postController");
const { Router } = require("express");

const postRouter = Router();

postRouter.get("/", postController.getAllPosts);
postRouter.get("/published", postController.getPublishedPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePost);
postRouter.delete("/:id", postController.deletePost);
postRouter.patch("/:id/publish", postController.publishPost);
postRouter.patch("/:id/unpublish", postController.unpublishPost);

module.exports = postRouter;
