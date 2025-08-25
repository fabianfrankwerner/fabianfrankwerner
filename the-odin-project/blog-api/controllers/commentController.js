const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user.userId; // This will come from JWT middleware

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.published) {
      return res
        .status(400)
        .json({ error: "Cannot comment on unpublished posts" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
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
        .json({ error: "Not authorized to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
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
        .json({ error: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
