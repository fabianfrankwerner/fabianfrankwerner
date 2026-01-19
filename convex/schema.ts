import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Note on providers:
 * We store providers as strings to keep the schema extensible.
 * As you add integrations, you can optionally tighten this with v.union(v.literal(...)).
 */

export default defineSchema({
  users: defineTable({
    /** Clerk user id (subject). */
    clerkUserId: v.string(),
    /** Optional denormalized profile fields for convenience. */
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_createdAt", ["createdAt"]),

  /**
   * A "connection" to an external social provider (OAuth or API key based).
   * Tokens/keys should be stored encrypted-at-rest by the application layer.
   */
  socialAccounts: defineTable({
    userId: v.id("users"),

    /** e.g. "devto", "x", "threads", "bluesky", "linkedin" */
    provider: v.string(),
    /** OAuth vs API-key */
    authType: v.union(v.literal("oauth"), v.literal("apiKey")),

    /** Provider-side account identity (if known). */
    externalUserId: v.optional(v.string()),
    handle: v.optional(v.string()),

    /** connection lifecycle */
    status: v.union(
      v.literal("active"),
      v.literal("revoked"),
      v.literal("error"),
    ),
    statusMessage: v.optional(v.string()),

    /**
     * OAuth token material (store encrypted as ciphertext strings).
     * For API-key auth, keep these fields empty.
     */
    accessTokenEnc: v.optional(v.string()),
    refreshTokenEnc: v.optional(v.string()),
    /** Unix ms when the access token expires */
    expiresAt: v.optional(v.number()),
    /** Normalized scopes list (if provided by the provider) */
    scopes: v.optional(v.array(v.string())),

    /**
     * API key metadata (do NOT store raw key here; store encrypted elsewhere).
     * apiKeyLast4 is for UX/debugging only.
     */
    apiKeyName: v.optional(v.string()),
    apiKeyLast4: v.optional(v.string()),
    apiKeyEnc: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_provider", ["userId", "provider"])
    .index("by_provider_externalUserId", ["provider", "externalUserId"])
    .index("by_createdAt", ["createdAt"]),

  /**
   * Draft content, independent of scheduling.
   * One draft can be scheduled multiple times (or to multiple providers).
   */
  drafts: defineTable({
    userId: v.id("users"),

    /** Target providers for preview/validation. */
    providerTargets: v.array(v.string()),

    title: v.optional(v.string()),
    bodyMarkdown: v.optional(v.string()),
    /**
     * Optional rich payload (e.g. tiptap JSON).
     * Keep as `any` until the editor format stabilizes.
     */
    bodyRich: v.optional(v.any()),

    /** Pre-split thread segments (X-style threads, etc.). */
    threadSegments: v.optional(v.array(v.string())),

    createdAt: v.number(),
    lastSavedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"])
    .index("by_createdAt", ["createdAt"]),

  /**
   * A scheduled "send" for one or more providers.
   * Delivery per provider is tracked in `deliveryAttempts`.
   */
  scheduledPosts: defineTable({
    userId: v.id("users"),
    draftId: v.optional(v.id("drafts")),

    providerTargets: v.array(v.string()),

    /** Unix ms timestamp when delivery should happen. */
    scheduledTime: v.number(),

    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),

    retryCount: v.number(),
    lastAttemptAt: v.optional(v.number()),

    /**
     * Provider-specific delivery results, urls, or payload references.
     * Keep open-ended until each provider integration solidifies.
     */
    metadata: v.optional(v.any()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_scheduledTime", ["userId", "scheduledTime"])
    .index("by_status_scheduledTime", ["status", "scheduledTime"])
    .index("by_createdAt", ["createdAt"]),

  /**
   * Auto repost/crosspost rules.
   * Example: when posting to "x", also post to ["threads","bluesky"].
   */
  repostRules: defineTable({
    userId: v.id("users"),
    sourceProvider: v.string(),
    targetProviders: v.array(v.string()),
    enabled: v.boolean(),

    policy: v.object({
      type: v.union(v.literal("immediate"), v.literal("delay")),
      delayMinutes: v.optional(v.number()),
    }),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_sourceProvider", ["userId", "sourceProvider"])
    .index("by_createdAt", ["createdAt"]),

  /**
   * Per-provider delivery attempts for observability/debugging.
   */
  deliveryAttempts: defineTable({
    userId: v.id("users"),
    scheduledPostId: v.id("scheduledPosts"),
    provider: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    responseCode: v.optional(v.number()),
    message: v.optional(v.string()),
    occurredAt: v.number(),
  })
    .index("by_scheduledPostId", ["scheduledPostId"])
    .index("by_userId_occurredAt", ["userId", "occurredAt"])
    .index("by_createdAt", ["occurredAt"]),
});
