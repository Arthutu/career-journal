import { type AppLoadContext } from "@remix-run/cloudflare";

import { type PlatformProxy } from "wrangler";

import { connection } from "./app/db/client";

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
interface Env {
    DB: D1Database;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
    interface AppLoadContext {
        cloudflare: Cloudflare;
        db: Awaited<ReturnType<typeof connection>>;
    }
}

type GetLoadContext = (args: {
    request: Request;
    context: {
        cloudflare: Cloudflare;
    }; // load context _before_ augmentation
}) => Promise<AppLoadContext>;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = async ({ context }) => {
    return {
        ...context,
        db: await connection(context.cloudflare.env.DB),
    };
};
