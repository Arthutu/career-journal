import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { useLoaderData } from "@remix-run/react";

import type { User } from "@prisma/client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";
import { Sidenav } from "~/ui/sidenav";

export const meta: MetaFunction = () => {
    return [{ title: "Career Journal" }];
};

export const loader: LoaderFunction = async ({ context }) => {
    const users = await context.db.user.findMany();

    return json(users);
};

export default function Index() {
    const users = useLoaderData<User[]>();

    return (
        <div>
            <SignedIn>
                <div className="flex min-h-screen w-full flex-col bg-muted/40 h-screen">
                    <Sidenav />

                    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 h-screen">
                        <main>
                            <h1>Index route</h1>
                            <p>You are signed in!</p>
                            <ul>
                                {users.map((user) => (
                                    <li key={user.id}>{user.firstName}</li>
                                ))}
                            </ul>
                        </main>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}
