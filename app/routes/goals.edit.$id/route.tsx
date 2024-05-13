import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/cloudflare";

import { useLoaderData } from "@remix-run/react";

import { Goals } from "@prisma/client";

import { getAuth } from "@clerk/remix/ssr.server";
import { parseWithZod } from "@conform-to/zod";
import { GoalForm, GoalSchema } from "~/forms/goal-form";

export const loader = async ({
    request,
    context,
    params,
    ...args
}: LoaderFunctionArgs) => {
    try {
        const { userId } = await getAuth({ request, context, params, ...args });

        if (!userId) {
            return redirect("/login");
        }

        const user = await context.db.users.findUniqueOrThrow({
            where: { authId: userId },
        });

        const goal = await context.db.goals.findUniqueOrThrow({
            select: {
                id: true,
                title: true,
                description: true,
                targetDate: true,
            },
            where: { userId: user.id, id: Number(params.id) },
        });

        return json(goal);
    } catch (error) {
        console.error(error);
        return redirect("/goals");
    }
};

export async function action({
    request,
    context,
    params,
    ...args
}: ActionFunctionArgs) {
    const { userId } = await getAuth({ request, context, params, ...args });

    if (!userId) {
        return redirect("/login");
    }

    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: GoalSchema });

    if (submission.status !== "success") {
        return json(submission.reply());
    }

    await context.db.goals.update({
        data: {
            title: submission.value.title,
            description: submission.value.description || "",
            targetDate: submission.value.targetDate,
        },
        where: { id: Number(params.id) },
    });

    return redirect("/goals");
}

export default function GoalsEdit() {
    const goal = useLoaderData<Goals>();

    return <GoalForm goal={goal} cta="Update Goal" />;
}
