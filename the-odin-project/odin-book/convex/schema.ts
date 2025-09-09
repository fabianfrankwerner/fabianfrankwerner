import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  // User profiles
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  // Posts
  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_createdAt", ["createdAt"]),

  // Comments
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  // Likes
  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]),

  // Follow requests
  followRequests: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
    ),
    createdAt: v.number(),
  })
    .index("by_fromUser", ["fromUserId"])
    .index("by_toUser", ["toUserId"])
    .index("by_fromUser_and_toUser", ["fromUserId", "toUserId"]),
});
