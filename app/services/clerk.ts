import { AppLoadContext } from "@remix-run/cloudflare";

import { PrismaClient } from "@prisma/client";

import { WebhookEvent } from "@clerk/remix/ssr.server";
import { Webhook } from "svix";

class ClerkError extends Error {
    constructor(message: string) {
        super(message);
        console.error(message);
        this.name = "ClerkError";
    }
}

interface ClerkEventHandler {
    handle(event: WebhookEvent): Promise<void>;
}

class ClerkUserCreatedEventHandler implements ClerkEventHandler {
    private db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async handle(event: WebhookEvent): Promise<void> {
        if (event.type !== "user.created") {
            throw new ClerkError(
                `Received invalid event type: ${event.type} for ClerkUserCreatedEventHandler`
            );
        }

        await this.db.user.create({
            data: {
                email: event.data.email_addresses[0].email_address,
                firstName: event.data.first_name,
                lastName: event.data.last_name,
                authId: event.data.id,
            },
        });
    }
}

export class ClerkService {
    private clerkWebhookSecret: string;
    private eventHandlers: Map<string, ClerkEventHandler>;

    constructor({ db, cloudflare }: AppLoadContext) {
        this.clerkWebhookSecret = cloudflare.env.CLERK_WEBHOOK_SECRET;
        this.eventHandlers = new Map<string, ClerkEventHandler>([
            ["user.created", new ClerkUserCreatedEventHandler(db)],
        ]);
    }

    private async validateEvent(request: Request): Promise<WebhookEvent> {
        const svixId = request.headers.get("svix-id");
        const svixTimestamp = request.headers.get("svix-timestamp");
        const svixSignature = request.headers.get("svix-signature");

        if (!svixId || !svixTimestamp || !svixSignature) {
            throw new ClerkError(
                "Clerk Event is missing required svix headers."
            );
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        return new Webhook(this.clerkWebhookSecret).verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    }

    async handle(request: Request): Promise<void> {
        const event = await this.validateEvent(request);

        const eventHandler = this.eventHandlers.get(event.type);

        if (eventHandler) {
            return await eventHandler.handle(event);
        }

        console.log(
            `Ignoring clerk event of type ${event.type}. No handler found.`
        );
    }
}
