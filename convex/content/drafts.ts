import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

export const getDrafts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    return await ctx.db
      .query("drafts")
      .withIndex("by_userId_updatedAt", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const upsertDraft = mutation({
  args: {
    draftId: v.optional(v.id("drafts")),
    providerTargets: v.array(v.string()),
    title: v.optional(v.string()),
    bodyMarkdown: v.optional(v.string()),
    bodyRich: v.optional(v.any()),
    threadSegments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);
    const now = Date.now();

    if (args.draftId) {
      const existing = await ctx.db.get(args.draftId);
      if (!existing) throw new Error("Draft not found");
      if (existing.userId !== user._id) throw new Error("Forbidden");

      await ctx.db.patch(args.draftId, {
        providerTargets: args.providerTargets,
        title: args.title,
        bodyMarkdown: args.bodyMarkdown,
        bodyRich: args.bodyRich,
        threadSegments: args.threadSegments,
        lastSavedAt: now,
        updatedAt: now,
      });

      return { draftId: args.draftId };
    }

    const draftId = await ctx.db.insert("drafts", {
      userId: user._id,
      providerTargets: args.providerTargets,
      title: args.title,
      bodyMarkdown: args.bodyMarkdown,
      bodyRich: args.bodyRich,
      threadSegments: args.threadSegments,
      createdAt: now,
      lastSavedAt: now,
      updatedAt: now,
    });

    return { draftId };
  },
});
