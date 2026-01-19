import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

export const listScheduledPosts = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("sent"),
        v.literal("failed"),
        v.literal("cancelled"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    let q = ctx.db
      .query("scheduledPosts")
      .withIndex("by_userId_scheduledTime", (q2) => q2.eq("userId", user._id))
      .order("desc");

    const all = await q.collect();
    if (!args.status) return all;
    return all.filter((p) => p.status === args.status);
  },
});

export const schedulePost = mutation({
  args: {
    draftId: v.optional(v.id("drafts")),
    providerTargets: v.array(v.string()),
    scheduledTime: v.number(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);
    const now = Date.now();

    if (args.draftId) {
      const draft = await ctx.db.get(args.draftId);
      if (!draft) throw new Error("Draft not found");
      if (draft.userId !== user._id) throw new Error("Forbidden");
    }

    const scheduledPostId = await ctx.db.insert("scheduledPosts", {
      userId: user._id,
      draftId: args.draftId,
      providerTargets: args.providerTargets,
      scheduledTime: args.scheduledTime,
      status: "pending",
      retryCount: 0,
      lastAttemptAt: undefined,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    });

    return { scheduledPostId };
  },
});

export const cancelScheduledPost = mutation({
  args: {
    scheduledPostId: v.id("scheduledPosts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    const post = await ctx.db.get(args.scheduledPostId);
    if (!post) return { ok: true };
    if (post.userId !== user._id) throw new Error("Forbidden");

    await ctx.db.patch(args.scheduledPostId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return { ok: true };
  },
});
