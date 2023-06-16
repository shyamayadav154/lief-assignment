import { PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "./ui/button";
import { DatePicker } from "./DatePicker";
import { SelectMenu } from "./SelectMenu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormEvent, FormEventHandler, useState } from "react";
import { Priority } from "@prisma/client";
import { api } from "~/utils/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "./ui/input";

export const priorityOptions = [{
    label: "Low",
    value: "LOW",
}, {
    label: "Medium",
    value: "MEDIUM",
}, {
    label: "High",
    value: "HIGH",
}];

const taskSchema = z.object({
    title: z.string().nonempty({ message: "Task is required" }),
    dueDate: z.date().refine((value) => value > new Date(), {
        message: "Date must be greater than today",
    }),
    priority: z.nativeEnum(Priority).default("LOW"),
});

function CreateTask() {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [priority, setPriority] = useState<Priority>("LOW");
    const apiContext = api.useContext();
    const addTask = api.task.create.useMutation();
    const user = useUser();

    if (!user) return null;
    if (user.isLoading) return <div>Loading...</div>;

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parsedDate = taskSchema.safeParse({
            title,
            dueDate,
            priority,
        });

        if (!parsedDate.success) return;
        if (!dueDate) return;

        addTask.mutate({
            dueDate,
            priority,
            title,
        }, {
            onSuccess: () => {
                setTitle("");
                setDueDate(undefined);
                setPriority("LOW");
                apiContext.task.getAll.invalidate();
            },
        });
    };

    const onSelectMenuChange = (value: string) => {
        setPriority(value as Priority);
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="space-y-2.5 bg-white p-2 rounded"
        >
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task..."
            />
            <div className="flex justify-between items-center">
                <div className="flex gap-2.5">
                    <DatePicker
                        onChange={setDueDate}
                        value={dueDate}
                        name="dueDate"
                        label="Due date"
                    />
                    <SelectMenu
                        onChange={onSelectMenuChange}
                        name="priority"
                        label="Priority"
                        options={priorityOptions}
                    />
                </div>
                <Button>Add task</Button>
            </div>
        </form>
    );
}

export default CreateTask;
