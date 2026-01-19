import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Ensure we have a `users` row corresponding to the current Clerk identity.
 * This is intentionally "helpful" scaffolding until the dedicated Clerk webhook
 * user-sync (README Phase 1) is implemented.
 */
export async function ensureUserForIdentity(
  ctx: MutationCtx | QueryCtx,
  identity: {
    subject: string;
    email?: string;
    name?: string;
    pictureUrl?: string;
  } | null,
) {
  if (!identity) throw new Error("Not authenticated");

  // Use `filter` instead of `withIndex` so this file typechecks even before
  // you run `npx convex dev` (which regenerates types/index names).
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
    .unique();

  if (existing) return existing;

  // Only mutations can insert.
  if (!("insert" in ctx.db)) {
    throw new Error(
      "User record missing. Run a mutation to initialize user or implement user sync webhook.",
    );
  }

  const now = Date.now();
  const userId = await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email: identity.email,
    displayName: identity.name,
    imageUrl: identity.pictureUrl,
    createdAt: now,
    updatedAt: now,
  });

  const created = await ctx.db.get(userId);
  if (!created) throw new Error("Failed to create user");
  return created;
}
