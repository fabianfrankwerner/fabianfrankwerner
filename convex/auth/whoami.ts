import { query } from "../_generated/server";
import { ensureUserForIdentity } from "../lib/auth";

export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ensureUserForIdentity(ctx, identity);

    return {
      identity,
      user,
    };
  },
});
