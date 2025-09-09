import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// ===== PROFILE FUNCTIONS =====

export const getCurrentUserProfile = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      _creationTime: v.number(),
      userId: v.id("users"),
      username: v.string(),
      displayName: v.string(),
      bio: v.optional(v.string()),
      avatar: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const createProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if username is already taken
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existingProfile) {
      throw new Error("Username already taken");
    }

    return await ctx.db.insert("profiles", {
      userId,
      username: args.username,
      displayName: args.displayName,
      bio: args.bio,
    });
  },
});

export const getUserProfile = query({
  args: { username: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      _creationTime: v.number(),
      userId: v.id("users"),
      username: v.string(),
      displayName: v.string(),
      bio: v.optional(v.string()),
      avatar: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
  },
});

// ===== POST FUNCTIONS =====

export const createPost = mutation({
  args: {
    content: v.string(),
  },
  returns: v.id("posts"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.content.trim().length === 0) {
      throw new Error("Post content cannot be empty");
    }

    return await ctx.db.insert("posts", {
      authorId: userId,
      content: args.content.trim(),
      createdAt: Date.now(),
    });
  },
});

export const getFeed = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("posts"),
      _creationTime: v.number(),
      authorId: v.id("users"),
      content: v.string(),
      createdAt: v.number(),
      author: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
      likesCount: v.number(),
      commentsCount: v.number(),
      isLiked: v.boolean(),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const limit = args.limit ?? 20;

    // Get all accepted follow relationships for the current user
    const following = userId
      ? await ctx.db
          .query("followRequests")
          .withIndex("by_fromUser", (q) => q.eq("fromUserId", userId))
          .filter((q) => q.eq(q.field("status"), "accepted"))
          .collect()
      : [];

    const followingUserIds = following.map((f) => f.toUserId);
    if (userId) followingUserIds.push(userId); // Include own posts

    // Get posts from followed users (including self)
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit * 2); // Get more to filter

    const filteredPosts = posts.filter((post) =>
      followingUserIds.includes(post.authorId),
    );

    // Get author info and stats for each post
    const postsWithDetails = await Promise.all(
      filteredPosts.slice(0, limit).map(async (post) => {
        const author = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", post.authorId))
          .unique();

        if (!author) throw new Error("Author profile not found");

        // Get likes count
        const likes = await ctx.db
          .query("likes")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();

        // Check if current user liked this post
        const isLiked = userId
          ? likes.some((like) => like.userId === userId)
          : false;

        // Get comments count
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();

        return {
          ...post,
          author: {
            username: author.username,
            displayName: author.displayName,
          },
          likesCount: likes.length,
          commentsCount: comments.length,
          isLiked,
        };
      }),
    );

    return postsWithDetails;
  },
});

export const getPost = query({
  args: { postId: v.id("posts") },
  returns: v.union(
    v.object({
      _id: v.id("posts"),
      _creationTime: v.number(),
      authorId: v.id("users"),
      content: v.string(),
      createdAt: v.number(),
      author: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
      likesCount: v.number(),
      commentsCount: v.number(),
      isLiked: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    const author = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", post.authorId))
      .unique();

    if (!author) throw new Error("Author profile not found");

    // Get likes count
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .collect();

    // Check if current user liked this post
    const isLiked = userId
      ? likes.some((like) => like.userId === userId)
      : false;

    // Get comments count
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .collect();

    return {
      ...post,
      author: {
        username: author.username,
        displayName: author.displayName,
      },
      likesCount: likes.length,
      commentsCount: comments.length,
      isLiked,
    };
  },
});

// ===== LIKE FUNCTIONS =====

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId),
      )
      .unique();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      return false;
    } else {
      // Like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId,
      });
      return true;
    }
  },
});

// ===== COMMENT FUNCTIONS =====

export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  returns: v.id("comments"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    return await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      content: args.content.trim(),
      createdAt: Date.now(),
    });
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  returns: v.array(
    v.object({
      _id: v.id("comments"),
      _creationTime: v.number(),
      postId: v.id("posts"),
      authorId: v.id("users"),
      content: v.string(),
      createdAt: v.number(),
      author: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
    }),
  ),
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect();

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", comment.authorId))
          .unique();

        if (!author) throw new Error("Author profile not found");

        return {
          ...comment,
          author: {
            username: author.username,
            displayName: author.displayName,
          },
        };
      }),
    );

    return commentsWithAuthors;
  },
});

// ===== FOLLOW FUNCTIONS =====

export const sendFollowRequest = mutation({
  args: { toUserId: v.id("users") },
  returns: v.id("followRequests"),
  handler: async (ctx, args) => {
    const fromUserId = await getAuthUserId(ctx);
    if (!fromUserId) throw new Error("Not authenticated");

    if (fromUserId === args.toUserId) {
      throw new Error("Cannot follow yourself");
    }

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("followRequests")
      .withIndex("by_fromUser_and_toUser", (q) =>
        q.eq("fromUserId", fromUserId).eq("toUserId", args.toUserId),
      )
      .unique();

    if (existingRequest) {
      throw new Error("Follow request already exists");
    }

    return await ctx.db.insert("followRequests", {
      fromUserId,
      toUserId: args.toUserId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const respondToFollowRequest = mutation({
  args: {
    requestId: v.id("followRequests"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Follow request not found");

    if (request.toUserId !== userId) {
      throw new Error("Not authorized to respond to this request");
    }

    await ctx.db.patch(args.requestId, {
      status: args.status,
    });

    return null;
  },
});

export const getFollowRequests = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("followRequests"),
      _creationTime: v.number(),
      fromUserId: v.id("users"),
      toUserId: v.id("users"),
      status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected"),
      ),
      createdAt: v.number(),
      fromUser: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const requests = await ctx.db
      .query("followRequests")
      .withIndex("by_toUser", (q) => q.eq("toUserId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();

    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const fromUser = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", request.fromUserId))
          .unique();

        if (!fromUser) throw new Error("User profile not found");

        return {
          ...request,
          fromUser: {
            username: fromUser.username,
            displayName: fromUser.displayName,
          },
        };
      }),
    );

    return requestsWithUsers;
  },
});

export const getFollowing = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("followRequests"),
      _creationTime: v.number(),
      toUserId: v.id("users"),
      toUser: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
    }),
  ),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const targetUserId = args.userId ?? currentUserId;

    if (!targetUserId) return [];

    const following = await ctx.db
      .query("followRequests")
      .withIndex("by_fromUser", (q) => q.eq("fromUserId", targetUserId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const followingWithUsers = await Promise.all(
      following.map(async (follow) => {
        const toUser = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", follow.toUserId))
          .unique();

        if (!toUser) throw new Error("User profile not found");

        return {
          ...follow,
          toUser: {
            username: toUser.username,
            displayName: toUser.displayName,
          },
        };
      }),
    );

    return followingWithUsers;
  },
});

export const getFollowers = query({
  args: { userId: v.optional(v.id("users")) },
  returns: v.array(
    v.object({
      _id: v.id("followRequests"),
      _creationTime: v.number(),
      fromUserId: v.id("users"),
      fromUser: v.object({
        username: v.string(),
        displayName: v.string(),
      }),
    }),
  ),
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const targetUserId = args.userId ?? currentUserId;

    if (!targetUserId) return [];

    const followers = await ctx.db
      .query("followRequests")
      .withIndex("by_toUser", (q) => q.eq("toUserId", targetUserId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const followersWithUsers = await Promise.all(
      followers.map(async (follow) => {
        const fromUser = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", follow.fromUserId))
          .unique();

        if (!fromUser) throw new Error("User profile not found");

        return {
          ...follow,
          fromUser: {
            username: fromUser.username,
            displayName: fromUser.displayName,
          },
        };
      }),
    );

    return followersWithUsers;
  },
});
