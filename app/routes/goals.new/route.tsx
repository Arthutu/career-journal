import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";

import { Form, useActionData } from "@remix-run/react";

import { getAuth } from "@clerk/remix/ssr.server";
import {
    getFormProps,
    useForm,
    getInputProps,
    getTextareaProps,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Auth } from "~/services/auth";
import { Button } from "~/ui/button";
import { DatePickerInput } from "~/ui/date-picker-input";
import { FormItem, FormLabel, FormMessage, FormProvider } from "~/ui/form";
import { Input } from "~/ui/input";
import { Textarea } from "~/ui/textarea";

const schema = z.object({
    title: z
        .string({ required_error: "Please enter a title for your goal" })
        .trim(),
    description: z.string().trim().optional(),
    targetDate: z.date({
        required_error: "Please select a target date for your goal",
    }),
});

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
    const submission = parseWithZod(formData, { schema });

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
    const lastResult = useActionData<typeof action>();

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema });
        },
        shouldValidate: "onInput",
    });

    return (
        <FormProvider context={form.context}>
            <Form
                method="post"
                className="flex flex-col gap-4 items-start w-full"
                {...getFormProps(form)}>
                <FormItem>
                    <FormLabel fieldName={fields.title.name}>Title</FormLabel>
                    <Input
                        placeholder="Promotion"
                        {...getInputProps(fields.title, {
                            type: "text",
                            ariaAttributes: true,
                        })}
                    />
                    <FormMessage fieldName={fields.title.name} />
                </FormItem>

                <FormItem>
                    <FormLabel fieldName={fields.description.name}>
                        Description
                    </FormLabel>
                    <Textarea
                        placeholder="I want to be promoted to Manager"
                        {...getTextareaProps(fields.description)}
                    />
                    <FormMessage fieldName={fields.description.name} />
                </FormItem>

                <FormItem>
                    <FormLabel fieldName={fields.targetDate.name}>
                        Target Date
                    </FormLabel>
                    <DatePickerInput
                        meta={fields.targetDate}
                        placeholder="When should this goal happen"
                    />
                    <FormMessage fieldName={fields.targetDate.name} />
                </FormItem>

                <Button type="submit">Create Goal</Button>
            </Form>
        </FormProvider>
    );
}
