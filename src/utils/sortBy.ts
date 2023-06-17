import { type RouterOutputs } from "./api";

export const sortByOptions = [
    {
        label: "None",
        value: "none",
    },
    {
        label: "Due Date",
        value: "date",
    },
    {
        label: "Priority",
        value: "priority",
    },

    {
        label: "Status",
        value: "completed",
    },
];

export type SortByEnum = "date" | "priority" | "none";
export type Tasks = RouterOutputs["task"]["getAll"];

export function sortByPriority(tasks: Tasks) {
    const priorityOrder = ["high", "medium", "low"];
    return tasks.sort((taskA, taskB) => {
        const priorityA = taskA.priority.toLowerCase();
        const priorityB = taskB.priority.toLowerCase();
        const priorityAIndex = priorityOrder.indexOf(priorityA);
        const priorityBIndex = priorityOrder.indexOf(priorityB);
        return priorityAIndex - priorityBIndex;
    });
}

export function sortByDueDate(tasks: Tasks) {
    return tasks.sort((taskA, taskB) => {
        if (taskA.dueDate == null || taskB.dueDate == null) return 0;
        const dueDateA = taskA.dueDate;
        const dueDateB = taskB.dueDate;
        return Number(dueDateA) - Number(dueDateB);
    });
}

export function sortByCompleted(tasks: Tasks) {
    return tasks.sort((taskA) => {
        if (taskA.done) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function sortTasks(sortBy: SortByEnum, tasks: Tasks) {
    if (!sortBy || sortBy === "none") return tasks;
    const tasksCopy = [...tasks];
    if (sortBy === "priority") return sortByPriority(tasksCopy);
    if (sortBy === "date") return sortByDueDate(tasksCopy);
    if (sortBy === "completed") return sortByCompleted(tasksCopy);
    return tasks;
}
