import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";

import { ClerkApp, SignedIn, SignedOut } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import clsx from "clsx";
import {
    PreventFlashOnWrongTheme,
    ThemeProvider,
    useTheme,
} from "remix-themes";
import { TooltipProvider } from "~/ui/tooltip";

import { themeSessionResolver } from "./sessions.server";
import "./tailwind.css";
import { Sidenav } from "./ui/sidenav";

export const loader = (args: LoaderFunctionArgs) => {
    return rootAuthLoader(args, async ({ request }) => {
        const { getTheme } = await themeSessionResolver(request);

        return { theme: getTheme() };
    });
};

export function links() {
    const preloadedFonts = [
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

function App() {
    const data = useLoaderData<typeof loader>();
    const [theme] = useTheme();

    return (
        <html lang="en" className={clsx(theme)}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
                <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
            </head>
            <body className="min-h-screen w-full antialiased">
                <SignedIn>
                    <div className="flex min-h-screen w-full flex-col bg-muted/40 h-screen">
                        <Sidenav />

                        <main className="px-4 py-4 sm:px-0 sm:pl-20 sm:pr-6">
                            <Outlet />
                        </main>
                    </div>
                </SignedIn>

                <SignedOut>
                    <Outlet />
                </SignedOut>

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

function AppWithProviders() {
    const data = useLoaderData<typeof loader>();

    return (
        <ThemeProvider
            specifiedTheme={data.theme}
            themeAction="/action/set-theme">
            <TooltipProvider delayDuration={0}>
                <App />
            </TooltipProvider>
        </ThemeProvider>
    );
}

export default ClerkApp(AppWithProviders, {
    appearance: {
        layout: {
            termsPageUrl: "https://thecareerjournal.com/terms",
            privacyPageUrl: "https://thecareerjournal.com/privacy-policy",
        },
        elements: {
            cardBox: "shadow-primary shadow-lg border-primary border-2",
            card: "dark:bg-muted/20 dark:border-b dark:border-white/20",
            footer: "dark:!bg-none bg-background",
            footerActionLink: "text-primary hover:text-primary",
            headerTitle: "text-foreground",
            button: "text-foreground dark:!border dark:!border-white/20 dark:hover:bg-white/20",
            logoImage: "dark:filter dark:invert",
        },
    },
});
