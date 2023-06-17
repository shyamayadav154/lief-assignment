import { Loader2, TimerIcon } from "lucide-react";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";



import { Button } from "~/components/ui/button";
import { type Priority } from "@prisma/client";
import { useDebounce } from "react-use";
import { Input } from "~/components/ui/input";
import { SelectMenu } from "~/components/SelectMenu";
import { priorityOptions } from "./create-task";
import { DatePicker } from "~/components/DatePicker";

type Task = RouterOutputs["task"]["getAll"][number];

type EditTaskProps = {
    task: Task;
    closeTaskDetails: () => void;
};

export const EditTask = ({ task, closeTaskDetails }: EditTaskProps) => {
    const [title, setTitle] = useState(task.title);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [description, setDescription] = useState(task.description ?? "");
    const [category, setCategory] = useState(task.category ?? "");
    const updateTask = api.task.update.useMutation();
    const deleteTask = api.task.delete.useMutation();
    const apiContext = api.useContext();
    const onSelectMenuChange = (value: string) => {
        setPriority(value as Priority);
    };
    const deleteTaskHandler = () => {
        deleteTask.mutate({
            taskId: task.id,
        }, {
            onSuccess: () => {
                void apiContext.task.getAll.invalidate();
            },
            onError(error) {
                console.log(error);
                alert("something went wrong");
            },
        });
    };

    useDebounce(
        () => {
            if (!dueDate) return;
            updateTask.mutate({
                taskId: task.id,
                title,
                description,
                dueDate,
                priority,
                category: category ?? undefined,
            }, {
                onSuccess: () => {
                    void apiContext.task.getAll.invalidate();
                },
                onError: () => alert("something went wrong"),
            });
        },
        300,
        [dueDate, title, priority, description, category],
    );

    return (
        <article
            className="cursor-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white mb-2">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className="text-xl"
                />
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 rouinded bg-white  items-center">
                <span className="text-gray-500">Priority</span>
                <span className="capitalize">
                    <SelectMenu
                        value={priority}
                        onChange={onSelectMenuChange}
                        name="priority"
                        label="Priority"
                        options={priorityOptions}
                    />
                </span>
                <span className="text-gray-500">Due date</span>
                <span>
                    <DatePicker
                        onChange={setDueDate}
                        value={dueDate}
                        name="dueDate"
                        label="Due date"
                    />
                </span>
                <span className="text-gray-500">Pomodoro</span>
                <span className="flex items-center">
                    <TimerIcon className="h-4 w-4 inline mr-2" />
                    {task.tomatoes}
                </span>
                <span className="text-gray-500">Category</span>
                <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    type="text"
                />
            </div>
            <textarea
                rows={4}
                className="w-full block col-span-2 mt-2 p-2 outline-none"
                placeholder="Add description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2.5 mt-2">
                <Button
                    disabled={deleteTask.isLoading}
                    variant="destructive"
                    onClick={deleteTaskHandler}
                    size="sm"
                >
                    {deleteTask.isLoading &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                </Button>
                <Button
                    onClick={closeTaskDetails}
                    variant="secondary"
                    className="bg-white border"
                    size="sm"
                >
                    Close
                </Button>
            </div>
        </article>
    );
};
