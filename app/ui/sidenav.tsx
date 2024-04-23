import { Link } from "@remix-run/react";

import { Gear, SidebarSimple } from "@phosphor-icons/react";

import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function Sidenav() {
    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex bg-white">
                <nav className="flex flex-col items-center gap-4 py-2">
                    <Link to="/">
                        <img
                            src="./career-journal-logo.svg"
                            alt="Career Journal Logo"
                            width={32}
                            height={32}
                        />
                    </Link>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/settings"
                                className="flex h-9 w-9 rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
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
                                <img
                                    src="./career-journal-logo.svg"
                                    alt="Career Journal Logo"
                                    width={32}
                                    height={32}
                                />
                                Career Journal
                            </Link>

                            <Link
                                to="/settings"
                                className="flex items-center gap-4 text-muted-foreground hover:text-foreground">
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
