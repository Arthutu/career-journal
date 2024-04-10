import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { WebhookEvent } from "@clerk/remix/ssr.server";
import { Webhook } from "svix";

export const action = async ({ request, context }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!CLERK_WEBHOOK_SECRET) {
        throw new Error(
            "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return json({ message: "No svix headers" }, 400);
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return json({ message: "An error ocurred" }, 400);
    }

    const eventType = evt.type;

    console.log(
        `Webhook with and ID of ${evt.data.id} and type of ${eventType}`
    );
    console.log("Webhook body:", body);

    if (eventType !== "user.created") {
        console.log(`Ignoring webhook with type of ${eventType}`);
        return json({}, 200);
    }

    await context.db.user.create({
        data: {
            email: evt.data.email_addresses[0].email_address,
            name: `${evt.data.first_name} ${evt.data.last_name}`,
        },
    });

    return json({}, 200);
};
