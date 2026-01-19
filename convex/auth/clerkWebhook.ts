import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";

type ClerkWebhookEvent =
  | {
      type: "user.created" | "user.updated";
      data: {
        id: string;
        email_addresses?: { email_address: string }[];
        primary_email_address_id?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
      };
    }
  | {
      type: "user.deleted";
      data: {
        id: string;
      };
    }
  | {
      type: string;
      data: unknown;
    };

export const clerkWebhook = httpAction(async (ctx, request) => {
  const signingSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!signingSecret) {
    console.warn("Missing CLERK_WEBHOOK_SECRET; rejecting Clerk webhook");
    return new Response("Webhook not configured", { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await request.text();

  let event: ClerkWebhookEvent;
  try {
    // Dynamically import svix to avoid bundling if unused and keep type surface small.
    const { Webhook } = await import("svix");
    const wh = new Webhook(signingSecret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("Failed to verify Clerk webhook", error);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const clerkUserId = event.data.id;

      let email: string | undefined;
      if (event.data.email_addresses && event.data.email_addresses.length > 0) {
        if (event.data.primary_email_address_id) {
          const primary = event.data.email_addresses.find(
            (e) => e.email_address === event.data?.primary_email_address_id,
          );
          email =
            primary?.email_address ??
            event.data.email_addresses[0]?.email_address;
        } else {
          email = event.data.email_addresses[0]?.email_address;
        }
      }

      const displayName = [event.data.first_name, event.data.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

      const imageUrl = event.data.image_url ?? undefined;

      await ctx.runMutation(internal.users.upsertUserFromClerk, {
        clerkUserId,
        email,
        displayName: displayName || undefined,
        imageUrl,
      });

      break;
    }
    case "user.deleted": {
      const clerkUserId = event.data.id;
      await ctx.runMutation(internal.users.deleteUserByClerkId, {
        clerkUserId,
      });
      break;
    }
    default: {
      console.log("Unhandled Clerk webhook event type", event.type);
    }
  }

  return new Response(null, { status: 200 });
});
