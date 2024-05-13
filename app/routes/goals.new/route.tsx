import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";

import { getAuth } from "@clerk/remix/ssr.server";
import { parseWithZod } from "@conform-to/zod";
import { GoalSchema, GoalForm } from "~/forms/goal-form";
import { Auth } from "~/services/auth";

export const loader = new Auth().checkUserLoggedIn;

export async function action({
    request,
    context,
    ...args
}: ActionFunctionArgs) {
    const { userId } = await getAuth({ request, context, ...args });

    if (!userId) {
        return redirect("/login");
    }

    const user = await context.db.users.findUniqueOrThrow({
        where: { authId: userId },
    });

    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: GoalSchema });

    if (submission.status !== "success") {
        return json(submission.reply());
    }

    await context.db.goals.create({
        data: {
            title: submission.value.title,
            description: submission.value.description,
            targetDate: submission.value.targetDate,
            user: { connect: { id: user.id } },
        },
    });

    return redirect("/goals");
}

export default function GoalsNew() {
    return <GoalForm />;
}
