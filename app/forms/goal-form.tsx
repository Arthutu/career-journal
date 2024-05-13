import { Form } from "@remix-run/react";

import { Goals } from "@prisma/client";

import {
    getFormProps,
    useForm,
    getInputProps,
    getTextareaProps,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Button } from "~/ui/button";
import { DatePickerInput } from "~/ui/date-picker-input";
import { FormItem, FormLabel, FormMessage, FormProvider } from "~/ui/form";
import { Input } from "~/ui/input";
import { Textarea } from "~/ui/textarea";

export const GoalSchema = z.object({
    title: z
        .string({ required_error: "Please enter a title for your goal" })
        .trim(),
    description: z.string().trim().optional(),
    targetDate: z.date({
        required_error: "Please select a target date for your goal",
    }),
});

export function GoalForm({
    goal = { title: "", description: "" },
    cta = "Create Goal",
}: {
    goal?: Omit<
        Goals,
        "id" | "userId" | "createdAt" | "updatedAt" | "targetDate"
    >;
    cta?: string;
}) {
    const [form, fields] = useForm({
        defaultValue: { ...goal },
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: GoalSchema });
        },
        shouldValidate: "onInput",
    });

    return (
        <FormProvider context={form.context}>
            <Form
                method="post"
                className="flex flex-col gap-4 items-start"
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

                <Button type="submit">{cta}</Button>
            </Form>
        </FormProvider>
    );
}
