import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
    type SortByEnum,
    sortByOptions,
    sortTasks,
    type Tasks,
} from "~/utils/sortBy";
import { cn } from "~/lib/utils";

import { SelectMenu } from "~/components/SelectMenu";
import { SingleTask } from "./single-task";
import LoadingSpinner from "~/components/LoadingSpinner";

function filterTasks(filterBy: FilterByEnum, tasks: Tasks) {
    if (filterBy === "all") {
        return tasks;
    } else if (filterBy === "active") {
        return tasks.filter((task) => !task.done);
    } else if (filterBy === "completed") {
        return tasks.filter((task) => task.done);
    } else {
        throw new Error("Unknown filter");
    }
}

type FilterByEnum = "all" | "active" | "completed";

function Tasklist() {
    const [sortedBy, setSortedBy] = useState<SortByEnum>(
        "none",
    );
    const [filterBy, setFilterBy] = useState<FilterByEnum>("all");

    const tasks = api.task.getAll.useQuery();
    const onSortByChangeHandler = (value: string) => {
        setSortedBy(value as SortByEnum);
    };

    if (tasks.isLoading) return <LoadingSpinner />;
    if (!tasks.data) return <div>Something went wrong</div>;
    if (tasks.data?.length === 0) return <div>No tasks</div>;

    const sortedTasks = sortTasks(sortedBy, tasks.data);
    const filteredTask = filterTasks(filterBy, sortedTasks);

    return (
        <section className="space-y-2.5 bg-white p-2 rounded">
            <div className="flex justify-between">
                <FilterButtonGroup filter={filterBy} setFilter={setFilterBy} />
                <SelectMenu
                    onChange={onSortByChangeHandler}
                    label="Sort By"
                    name="sortBy"
                    options={sortByOptions}
                />
            </div>
            <ul role="list" className="space-y-2.5">
                {filteredTask?.map((task) => <SingleTask key={task.id} task={task} />)}
            </ul>
        </section>
    );
}

export default Tasklist;

type ButtonGroupProps = {
    setFilter: Dispatch<SetStateAction<FilterByEnum>>;
    filter: FilterByEnum;
};

const FilterButtonGroup = ({ setFilter, filter }: ButtonGroupProps) => {
    return (
        <span className="isolate inline-flex rounded-md  text-sm">
            <button
                onClick={() => setFilter("all")}
                type="button"
                className={cn(
                    "relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm  border hover:bg-gray-50 focus:z-10",
                    {
                        "bg-gray-100": filter === "all",
                    },
                )}
            >
                All
            </button>
            <button
                onClick={() => setFilter("active")}
                type="button"
                className={cn(
                    "relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm  border hover:bg-gray-50 focus:z-10",
                    {
                        "bg-gray-100": filter === "active",
                    },
                )}
            >
                Active
            </button>
            <button
                onClick={() => setFilter("completed")}
                type="button"
                className={cn(
                    "relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm  border hover:bg-gray-50 focus:z-10",
                    {
                        "bg-gray-100": filter === "completed",
                    },
                )}
            >
                Completed
            </button>
        </span>
    );
};
