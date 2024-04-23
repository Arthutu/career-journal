import { createCookieSessionStorage } from "@remix-run/cloudflare";

import { createThemeSessionResolver } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "theme",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: [process.env.COOKIE_SECRET!],
        ...(process.env.NODE_ENV === "production"
            ? { domain: process.env.DOMAIN, secure: true }
            : {}),
    },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
