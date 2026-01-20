# Phase 1: Foundation & The "Realtime" Core

- [x] Install and initialize Convex (`npm install convex`).
- [x] Install and configure Clerk (`@clerk/nextjs`).
- [x] Integration: Configure `auth.config.ts` in Convex to verify Clerk JWTs (securing your backend).
- [x] Create a `ConvexProviderWithClerk` wrapper in your root layout to sync auth state.
- [x] Define the initial `schema.ts` in Convex (Users, Posts tables).
- [x] Create a "User Sync" webhook: When a user signs up in Clerk, trigger a Convex http-action to store them in your `users` table.
- [ ] Properly deploy
- [ ] make the login redirect be instant without flickering

# Phase 2: The "Zen" Editor (Convex Powered)

- [ ] Implement the Tiptap editor with Markdown extensions.
- [ ] Realtime Save: Create a Convex mutation (`saveDraft`) that triggers on a debounced keystroke (replacing the need for a manual "Save" button).
- [ ] Live Threading: Build a `useQuery` subscription that fetches the current draft; if you edit it in one tab, it updates instantly in another.
- [ ] Create the "Twitter Preview" component that reads directly from the reactive Convex query.
- [ ] Implement "Thread Logic": A function to split text blocks by `\n\n` or a specific delimiter into an array of strings in the DB.

# Phase 3: The Scheduling Engine (Convex Crons)

- [ ] Create Convex Actions (internal API handlers) to post to X/Twitter and LinkedIn APIs (Actions allow `fetch`, Mutations do not).
- [ ] The Queue: Define a schema for `scheduled_posts` with a `unix_timestamp`.
- [ ] Scheduler: Use `ctx.scheduler.runAt` in Convex to schedule the posting Action at the exact user-defined time.
- [ ] Cron Jobs: Set up a `crons.ts` file in Convex to run a cleanup job every night (e.g., mark "failed" posts).
- [ ] Build the Calendar UI: Dragging a post updates its `scheduled_time` field, which automatically cancels the old scheduled job and creates a new one via a Mutation.

# Phase 4: Media & Assets (Convex Storage)

- [ ] Use Convex File Storage: Implement an `uploadUrl` generation flow for drag-and-drop image uploading in the editor.
- [ ] Store the `storageId` in the Post document.
- [ ] Build a "Media Gallery" component that queries all files uploaded by the current user.
- [ ] Add image optimization/rendering using the `next/image` component with the URLs returned by `ctx.storage.getUrl`.

# Phase 5: Monetization (Stripe + Clerk Organizations)

- [ ] Team Support: Enable "Organizations" in the Clerk Dashboard.
- [ ] Update Convex functions to check `ctx.auth.getUserIdentity()` for organization permissions (e.g., `org_role: 'admin'`).
- [ ] Payments: Create a Convex Action to handle Stripe Checkout session creation.
- [ ] Webhooks: Create a Convex HTTP action to handle Stripe webhooks (upgrading the `subscriptionStatus` in the `orgs` table).
- [ ] The Gate: Add a check at the top of your "Schedule" mutation: `if (postCount > freeLimit) throw new Error("Upgrade needed")`.

# Phase 6: Open Source & Self-Hosting

- [ ] Create a `docker-compose.yml` for the -Self-Hosted- version of Convex (Convex is open source, but the cloud version is managed).
- [ ] Write a "One-Click Deploy" guide for Vercel.
- [ ] Add a visual architecture diagram in the README showing how Next.js, Clerk, and Convex interact.
- [ ] License: Add the license file (AGPL or MIT).
