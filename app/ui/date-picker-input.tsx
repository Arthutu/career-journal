import {
    FieldMetadata,
    unstable_useControl as useControl,
} from "@conform-to/react";
import { CalendarBlank } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "~/ui/button";
import { Calendar } from "~/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { cn } from "~/utils/styles";

export function DatePickerInput({
    meta,
    placeholder = "Pick a date",
}: {
    meta: FieldMetadata<Date>;
    placeholder?: string;
}) {
    const control = useControl(meta);

    return (
        <>
            <input
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                ref={control.register}
                name={meta.name}
                defaultValue={
                    meta.initialValue
                        ? new Date(meta.initialValue).toISOString()
                        : ""
                }
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "pl-3 text-left font-normal",
                            !control.value && "text-muted-foreground"
                        )}>
                        {control.value ? (
                            format(control.value, "PPP")
                        ) : (
                            <span>{placeholder}</span>
                        )}
                        <CalendarBlank className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        initialFocus
                        selected={new Date(control.value ?? "")}
                        onSelect={(value) => {
                            control.change(value?.toISOString() ?? "");
                        }}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}
