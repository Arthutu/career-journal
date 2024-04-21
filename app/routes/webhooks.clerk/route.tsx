import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { ClerkService } from "~/services/clerk";

export const action = async ({ request, context }: ActionFunctionArgs) => {
    if (request.method !== "POST") {
        return json({ message: "Method not allowed" }, 405);
    }

    try {
        const service = new ClerkService(context);
        await service.handle(request);

        return json({}, 200);
    } catch (error) {
        return json(
            { message: "An error ocurred when handling a clerk event." },
            400
        );
    }
};
