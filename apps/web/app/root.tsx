import type { LoaderFunction } from "@remix-run/node";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import { ClerkApp } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

import "./tailwind.css";

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function links() {
    let preloadedFonts = [
        "inter-roman-latin-var.woff2",
        "inter-italic-latin-var.woff2",
    ];

    return [
        ...preloadedFonts.map((font) => ({
            rel: "preload",
            as: "font",
            href: `/fonts/${font}`,
            crossOrigin: "anonymous",
        })),
    ];
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="min-h-screen w-full antialiased">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

function App() {
    return <Outlet />;
}

export default ClerkApp(App, {
    appearance: {
        layout: {
            termsPageUrl: "https://thecareerjournal.com/terms",
            privacyPageUrl: "https://thecareerjournal.com/privacy-policy",
        },
        elements: {
            cardBox: "dark:!shadow-white/50 dark:shadow-sm",
            card: "dark:bg-black/70 dark:border-b dark:border-white/20",
            footer: "dark:!bg-none bg-black/40",
            footerActionLink:
                "text-titan-500 hover:text-titan-500 dark:text-gigas-500",
            headerTitle: "dark:text-white",
            button: "dark:text-white dark:!border dark:!border-white/20 dark:hover:bg-white/10",
            logoImage: "dark:filter dark:invert",
        },
    },
});
