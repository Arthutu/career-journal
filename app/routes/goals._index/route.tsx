import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/cloudflare";

import { Form, Link, useLoaderData } from "@remix-run/react";

import { Goals } from "@prisma/client";

import { getAuth } from "@clerk/remix/ssr.server";
import { DotsThree, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { GoalSchema } from "~/forms/goal-form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/ui/alert-dialog";
import { Button, buttonVariants } from "~/ui/button";
import { DataTable } from "~/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/ui/dropdown-menu";
import { cn } from "~/utils/styles";

export const columns: ColumnDef<Goals>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "targetDate",
        header: "Target Date",
        cell: ({ row }) => {
            const targetDate = new Date(row.getValue("targetDate"));

            return targetDate.toLocaleDateString();
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const goal = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsThree className="h-8 w-8" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="w-full cursor-pointer">
                            <Link
                                className="flex gap-2 items-center w-full"
                                to={`/goals/edit/${goal.id}`}>
                                <PencilSimple size={16} />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <AlertDialog>
                            <AlertDialogTrigger className="w-full">
                                <DropdownMenuItem
                                    className="flex gap-2 text-red-500 items-center cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}>
                                    <Trash size={16} />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <Form method="post" action="/goals?index">
                                    <input
                                        type="hidden"
                                        name="goalId"
                                        value={goal.id}
                                    />

                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your{" "}
                                            <b>{goal.title}</b> goal and untag
                                            all journal entries associated with
                                            it.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            type="submit"
                                            className={cn(
                                                buttonVariants({
                                                    variant: "destructive",
                                                })
                                            )}>
                                            Yes, delete goal
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </Form>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

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

export const action = async ({
    request,
    context,
    ...args
}: ActionFunctionArgs) => {
    const { userId } = await getAuth({ request, context, ...args });

    if (!userId) {
        return redirect("/login");
    }

    const user = await context.db.users.findUniqueOrThrow({
        where: { authId: userId },
    });

    const goalId = (await request.formData()).get("goalId");

    if (!goalId) {
        return redirect("/goals");
    }

    await context.db.goals.delete({
        where: { id: Number(goalId), userId: user.id },
    });

    return redirect("/goals");
};

export default function GoalsIndex() {
    const goals = useLoaderData<typeof loader>();

    return (
        <div className="flex flex-col gap-4">
            <Link
                to="/goals/new"
                className="flex items-center gap-2 underline-offset-4 hover:underline self-end">
                <Plus className="w-4 h-4" />
                Add Goal
            </Link>

            <DataTable columns={columns} data={goals} />
        </div>
    );
}
