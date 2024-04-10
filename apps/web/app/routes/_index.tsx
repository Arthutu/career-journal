import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { useLoaderData } from "@remix-run/react";

import type { User } from "@prisma/client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/remix";

export const meta: MetaFunction = () => {
    return [{ title: "Career Journal" }];
};

export let loader: LoaderFunction = async ({ context }) => {
    const users = await context.db.user.findMany();

    return json(users);
};

export default function Index() {
    const users = useLoaderData<User[]>();

    return (
        <div>
            <SignedIn>
                <h1>Index route</h1>
                <p>You are signed in!</p>
                <main>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </main>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}
