import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

export const listRepostRules = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    return await ctx.db
      .query("repostRules")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const setRepostRule = mutation({
  args: {
    sourceProvider: v.string(),
    targetProviders: v.array(v.string()),
    enabled: v.boolean(),
    policy: v.object({
      type: v.union(v.literal("immediate"), v.literal("delay")),
      delayMinutes: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);
    const now = Date.now();

    const existing = await ctx.db
      .query("repostRules")
      .withIndex("by_userId_sourceProvider", (q) =>
        q.eq("userId", user._id).eq("sourceProvider", args.sourceProvider),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        targetProviders: args.targetProviders,
        enabled: args.enabled,
        policy: args.policy,
        updatedAt: now,
      });
      return { repostRuleId: existing._id };
    }

    const repostRuleId = await ctx.db.insert("repostRules", {
      userId: user._id,
      sourceProvider: args.sourceProvider,
      targetProviders: args.targetProviders,
      enabled: args.enabled,
      policy: args.policy,
      createdAt: now,
      updatedAt: now,
    });

    return { repostRuleId };
  },
});
