import * as React from "react";

import { FormProvider, useField } from "@conform-to/react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Label } from "~/ui/label";
import { cn } from "~/utils/styles";

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex flex-col gap-2 w-full", className)}
            {...props}
        />
    );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
        fieldName: string;
        className?: string;
    }
>(({ fieldName, className, ...props }, ref) => {
    const [meta] = useField(fieldName);

    return (
        <Label
            ref={ref}
            className={cn(meta.errors && "text-destructive", className)}
            htmlFor={meta.id}
            {...props}
        />
    );
});
FormLabel.displayName = "FormLabel";

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement> & {
        fieldName: string;
        className?: string;
    }
>(({ fieldName, className, ...props }, ref) => {
    const [meta] = useField(fieldName);

    if (!meta.errors) {
        return null;
    }

    return (
        <p
            ref={ref}
            className={cn("text-sm font-medium text-destructive", className)}
            {...props}>
            {meta.errors}
        </p>
    );
});
FormMessage.displayName = "FormMessage";

export { FormProvider, FormItem, FormLabel, FormMessage };
