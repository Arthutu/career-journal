import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";

import { getAuth } from "@clerk/remix/ssr.server";

export class Auth {
    async checkUserLoggedIn(args: LoaderFunctionArgs) {
        const { userId } = await getAuth(args);

        if (!userId) {
            return redirect("/login");
        }

        return null;
    }
}
