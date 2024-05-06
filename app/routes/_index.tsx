import type { MetaFunction } from "@remix-run/cloudflare";

import { Auth } from "~/services/auth";

export const meta: MetaFunction = () => {
    return [{ title: "Career Journal" }];
};

export const loader = new Auth().checkUserLoggedIn;

export default function Index() {
    return <h1>Index</h1>;
}
