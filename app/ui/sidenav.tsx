import { Link } from "@remix-run/react";

import { Gear, SidebarSimple, Target } from "@phosphor-icons/react";

import { Button } from "./button";
import { Logo } from "./logo";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function Sidenav() {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 py-2">
                    <Link to="/">
                        <Logo />
                    </Link>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/goals"
                                className="flex h-9 w-9 rounded-lg md:h-8 md:w-8">
                                <Target size={32} />
                                <span className="sr-only">Goals</span>
                            </Link>
                        </TooltipTrigger>

                        <TooltipContent side="right">Goals</TooltipContent>
                    </Tooltip>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/settings"
                                className="flex h-9 w-9 rounded-lg md:h-8 md:w-8">
                                <Gear size={32} />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>

            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="sm:hidden">
                            <SidebarSimple className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to="/" className="flex items-center gap-4">
                                <Logo />
                                Career Journal
                            </Link>

                            <Link
                                to="/goals"
                                className="flex items-center gap-4">
                                <Target size={32} />
                                Goals
                            </Link>

                            <Link
                                to="/settings"
                                className="flex items-center gap-4">
                                <Gear size={32} />
                                Settings
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </>
    );
}
