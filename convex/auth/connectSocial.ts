import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

/**
 * Social connection stubs.
 * This does not implement OAuth flows; it only stores already-obtained token material.
 */

export const listConnections = query({
  args: {
    provider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    if (args.provider) {
      return await ctx.db
        .query("socialAccounts")
        .withIndex("by_userId_provider", (q) =>
          q.eq("userId", user._id).eq("provider", args.provider!),
        )
        .collect();
    }

    return await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createConnection = mutation({
  args: {
    provider: v.string(),
    authType: v.union(v.literal("oauth"), v.literal("apiKey")),

    externalUserId: v.optional(v.string()),
    handle: v.optional(v.string()),

    // OAuth token material (encrypted by client/app layer before being sent here)
    accessTokenEnc: v.optional(v.string()),
    refreshTokenEnc: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    scopes: v.optional(v.array(v.string())),

    // API key material (encrypted by client/app layer before being sent here)
    apiKeyName: v.optional(v.string()),
    apiKeyLast4: v.optional(v.string()),
    apiKeyEnc: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);
    const now = Date.now();

    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId_provider", (q) =>
        q.eq("userId", user._id).eq("provider", args.provider),
      )
      .collect();

    // For now we allow multiple connections per provider (e.g. multiple Dev.to orgs later).
    // If you want strict 1-per-provider, switch this to unique and patch the existing doc.
    const id = await ctx.db.insert("socialAccounts", {
      userId: user._id,
      provider: args.provider,
      authType: args.authType,
      externalUserId: args.externalUserId,
      handle: args.handle,
      status: "active",
      accessTokenEnc: args.accessTokenEnc,
      refreshTokenEnc: args.refreshTokenEnc,
      expiresAt: args.expiresAt,
      scopes: args.scopes,
      apiKeyName: args.apiKeyName,
      apiKeyLast4: args.apiKeyLast4,
      apiKeyEnc: args.apiKeyEnc,
      createdAt: now,
      updatedAt: now,
      // If there is already a connection, keep it—this stub doesn't enforce uniqueness.
      statusMessage:
        existing.length > 0
          ? "Multiple connections for same provider exist; this is allowed by stub."
          : undefined,
    });

    return { connectionId: id };
  },
});

export const deleteConnection = mutation({
  args: {
    connectionId: v.id("socialAccounts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    const conn = await ctx.db.get(args.connectionId);
    if (!conn) return { ok: true };
    if (conn.userId !== user._id) throw new Error("Forbidden");

    await ctx.db.delete(args.connectionId);
    return { ok: true };
  },
});
