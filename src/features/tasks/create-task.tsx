import { Button } from "~/components/ui/button";
import * as z from "zod";
import { type FormEvent, useState } from "react";
import { Priority } from "@prisma/client";
import { api } from "~/utils/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "~/components/ui/input";
import { DatePicker } from "~/components/DatePicker";
import { SelectMenu } from "~/components/SelectMenu";
import { Loader2 } from "lucide-react";

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
    const [priority, setPriority] = useState<Priority | undefined>(undefined);
    const [tomatoesToComplete, setTomatoesToComplete] = useState(3);
    const apiContext = api.useContext();
    const addTask = api.task.create.useMutation();
    const user = useUser();

    const isButtonDisabled = addTask.status === "loading" || !title || !dueDate ||
        !priority;

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !dueDate || !priority) return alert("Please fill all fields");

        const parsedDate = taskSchema.safeParse({
            title,
            dueDate,
            priority,
        });

        console.log({
            parsedDate,
        });
        if (!parsedDate.success) return;
        if (!dueDate) return;

        addTask.mutate({
            dueDate,
            priority,
            title,
            tomatoesToComplete,
        }, {
            onSuccess: () => {
                setTitle("");
                setDueDate(undefined);
                void apiContext.task.getAll.invalidate();
            },
        });
    };

    const onSelectMenuChange = (value: string) => {
        setPriority(value as Priority);
    };

    if (!user) return null;

    return (
        <form
            onSubmit={onSubmitHandler}
            className="space-y-2.5 bg-white p-2 rounded"
        >
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2.5">
                <div className="flex justify-between gap-2.5">
                    <Input
                        type="number"
                        name="tomatoes"
                        placeholder="Tomatoes"
                        className="w-[120px]"
                        min={1}
                        value={tomatoesToComplete}
                        onChange={(e) => setTomatoesToComplete(parseInt(e.target.value))}
                    />
                    <DatePicker
                        onChange={setDueDate}
                        value={dueDate}
                        name="dueDate"
                        label="Due date"
                    />
                    <SelectMenu
                        value={priority}
                        onChange={onSelectMenuChange}
                        name="priority"
                        label="Priority"
                        options={priorityOptions}
                    />
                </div>
                <Button className="" disabled={isButtonDisabled}>
                    {addTask.isLoading &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add
                </Button>
            </div>
        </form>
    );
}

export default CreateTask;
