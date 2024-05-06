import { Outlet } from "@remix-run/react";

import { Auth } from "~/services/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/ui/card";

export const loader = new Auth().checkUserLoggedIn;

export default function Goals() {
    return (
        <section id="goals" className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Goals</CardTitle>
                    <CardDescription>
                        Define the goals you want to achieve in your career. You
                        can use your goals to tag your journal entries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Outlet />
                </CardContent>
            </Card>
        </section>
    );
}
