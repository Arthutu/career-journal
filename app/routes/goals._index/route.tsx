import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";

import { Link, useLoaderData } from "@remix-run/react";

import { getAuth } from "@clerk/remix/ssr.server";
import { Plus } from "@phosphor-icons/react";

export const loader = async ({
    request,
    context,
    ...args
}: LoaderFunctionArgs) => {
    const { userId } = await getAuth({ request, context, ...args });

    if (!userId) {
        return redirect("/login");
    }

    const user = await context.db.users.findUniqueOrThrow({
        where: { authId: userId },
    });

    const goals = await context.db.goals.findMany({
        select: { id: true, title: true, description: true, targetDate: true },
        where: { userId: user.id },
    });

    return json(goals);
};

export default function GoalsIndex() {
    const goals = useLoaderData<typeof loader>();

    return (
        <>
            <Link
                to="/goals/new"
                className="flex items-center gap-2 underline-offset-4 hover:underline">
                <Plus className="w-4 h-4" />
                Add Goal
            </Link>

            <ul className="flex flex-col gap-4">
                {goals?.map((goal) => (
                    <li key={goal.id}>
                        <Link to={`/goals/${goal.id}`}>
                            <h2>{goal.title}</h2>
                            <p>{goal.description}</p>
                            <p>{goal.targetDate}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
