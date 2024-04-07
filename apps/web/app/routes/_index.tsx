import type { MetaFunction } from "@remix-run/node";

import {
    SignedIn,
    SignedOut,
    RedirectToSignIn,
    UserButton,
} from "@clerk/remix";

export const meta: MetaFunction = () => {
    return [{ title: "Career Journal" }];
};

export default function Index() {
    return (
        <div>
            <SignedIn>
                <h1>Index route</h1>
                <p>You are signed in!</p>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </div>
    );
}
