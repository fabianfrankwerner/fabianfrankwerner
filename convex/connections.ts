import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const saveDevToKey = mutation({
  args: { apiKey: v.string() },
  handler: async (ctx, { apiKey }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId_provider", (q) =>
        q.eq("userId", user._id).eq("provider", "devto"),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        authType: "apiKey",
        apiKeyEnc: apiKey, // In a real app, encrypt this!
        status: "active",
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("socialAccounts", {
        userId: user._id,
        provider: "devto",
        authType: "apiKey",
        apiKeyEnc: apiKey, // In a real app, encrypt this!
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getDevToConnection = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const account = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId_provider", (q) =>
        q.eq("userId", user._id).eq("provider", "devto"),
      )
      .unique();

    if (!account) return null;

    // Return public info only
    return {
      _id: account._id,
      status: account.status,
      // We mask the key for display
      maskedKey: account.apiKeyEnc
        ? `...${account.apiKeyEnc.slice(-4)}`
        : undefined,
    };
  },
});

export const getDevToKeyInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const account = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId_provider", (q) =>
        q.eq("userId", userId).eq("provider", "devto"),
      )
      .unique();

    if (!account || !account.apiKeyEnc) {
      return null;
    }

    return account.apiKeyEnc;
  },
});
