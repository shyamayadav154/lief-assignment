import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortByEnum = "date" | "priority" | "custom";

type SortByProps = {
    sortedBy: SortByEnum;
    setSortedBy: React.Dispatch<React.SetStateAction<SortByEnum>>;
};

function SortBy({ sortedBy, setSortedBy }: SortByProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-1  rounded-md">
                Sort By
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Due date</DropdownMenuItem>
                <DropdownMenuItem>Task priority</DropdownMenuItem>
                <DropdownMenuItem>Custom</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SortBy;
