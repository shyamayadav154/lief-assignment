import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type Priority } from "@prisma/client";

type Option = {
    label: string;
    value: string;
};

type SelectMenuProps = {
    label: string;
    name: string;
    value?: string;
    onChange: (value: string) => void;
    options: Option[];
};

export function SelectMenu(
    { label = "Select", name = "select",value ,onChange, options }: SelectMenuProps,
) {
    return (
        <Select defaultValue={value} onValueChange={(value: Priority) => onChange(value)} name={name}>
            <SelectTrigger className="w-[110px]">
                <SelectValue className="uppercase" placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {options.map((option: Option) => (
                        <SelectItem
                            key={option.label}
                            className="capitalize"
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
