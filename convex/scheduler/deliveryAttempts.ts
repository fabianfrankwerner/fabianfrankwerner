import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

/**
 * Observability stubs.
 * Later, the posting actions can call `logAttempt` as they progress.
 */

export const logAttempt = mutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
    provider: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    responseCode: v.optional(v.number()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    const post = await ctx.db.get(args.scheduledPostId);
    if (!post) throw new Error("Scheduled post not found");
    if (post.userId !== user._id) throw new Error("Forbidden");

    await ctx.db.insert("deliveryAttempts", {
      userId: user._id,
      scheduledPostId: args.scheduledPostId,
      provider: args.provider,
      status: args.status,
      responseCode: args.responseCode,
      message: args.message,
      occurredAt: Date.now(),
    });

    return { ok: true };
  },
});

export const listAttemptsForScheduledPost = query({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    const post = await ctx.db.get(args.scheduledPostId);
    if (!post) return [];
    if (post.userId !== user._id) throw new Error("Forbidden");

    return await ctx.db
      .query("deliveryAttempts")
      .withIndex("by_scheduledPostId", (q) =>
        q.eq("scheduledPostId", args.scheduledPostId),
      )
      .collect();
  },
});
