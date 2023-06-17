import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, TagIcon, TimerIcon } from "lucide-react";
import { api, type RouterOutputs } from "~/utils/api";
import { type Dispatch, type SetStateAction, useState } from "react";
import { SelectMenu } from "./SelectMenu";
import {
    type SortByEnum,
    sortByOptions,
    sortTasks,
    type Tasks,
} from "~/utils/sortBy";
import { ClockIcon } from "@heroicons/react/24/outline";
import { DatePicker } from "./DatePicker";
import { priorityOptions } from "./CreateTask";
import { type Priority } from "@prisma/client";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { Input } from "./ui/input";
import { useDebounce } from "react-use";
import {
    ChevronUpIcon,
    PauseIcon,
    PlayIcon,
    StopIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { Circle } from "rc-progress";
import { relativeDay } from "~/utils/helper";
import { usePomodoroState } from "~/context/global";
import ResizablePanel from "./ResizablePanel";

function filterTasks(filterBy: FilterByEnum, tasks: Tasks) {
    if (filterBy === "all") {
        return tasks;
    } else if (filterBy === "active") {
        return tasks.filter((task) => !task.done);
    } else if (filterBy === "completed") {
        return tasks.filter((task) => task.done);
    } else {
        throw new Error('Unknown filter');
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

    if (tasks.isLoading) return <div>Loading...</div>;
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

type Task = RouterOutputs["task"]["getAll"][number];

const SingleTask = ({ task }: { task: Task }) => {
    const [isShowMore, setIsShowMore] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(false);
    const {
        isTimerRunning,
        restartTimer,
        setIsTimerRunning,
        setTimerTaskId,
        timerTaskId,
    } = usePomodoroState();
    const toggleStatus = api.task.toggleStatus.useMutation();
    const apiContext = api.useContext();

    const onCheckboxChange = () => {
        toggleStatus.mutate({ taskId: task.id }, {
            onSuccess: () => {
                void apiContext.task.getAll.invalidate;
            },
        });
    };
    const onPlayClick = () => {
        setIsShowTimer(!isShowTimer);
        setIsShowMore(false);

        if (timerTaskId === task.id) {
            setIsShowTimer(true);
            return;
        }

        if (!isTimerRunning) {
            setIsTimerRunning(true);
            setTimerTaskId(task.id);
            return;
        }

        if (isTimerRunning) {
            if (timerTaskId === task.id) {
                // setIsTimerRunning(false);
                // setTimerTaskId(null);
            } else {
                setIsTimerRunning(true);
                setTimerTaskId(task.id);
                restartTimer(25);
            }
            return;
        }
    };
    const closeTaskDetails = () => setIsShowMore(false);
    const openTaskDetails = () => {
        if (isShowTimer) {
            setIsShowTimer(false);
        }
        setIsShowMore(true);
    };

    console.log({
        isShowTimer,
        isShowMore,
        isTimerRunning,
    });

    const hasTimerTaskId = timerTaskId === task.id;
    const showPomodoroTimer = (!isShowMore && isShowTimer) && hasTimerTaskId;

    return (
        <ResizablePanel>
            <li className="border w-full flex gap-2.5 items-start rounded  p-2 bg-gray-50">
                <section className="mt-1.5">
                    <input
                        onChange={onCheckboxChange}
                        className="h-4 w-4"
                        type="checkbox"
                        defaultChecked={task.done}
                    />
                </section>

                <section
                    onClick={openTaskDetails}
                    className="cursor-pointer flex-1 select-none"
                >
                    {!isShowMore && (
                        <article>
                            <div className="text-xl">
                                {task.title}
                            </div>
                            <div className="flex gap-2">
                                <div className="text-xs p-1 capitalize font-medium  border">
                                    <ExclamationTriangleIcon className="h-3 w-3 inline mr-2" />
                                    {task.priority?.toLowerCase()}
                                </div>
                                <div className="text-xs flex items-center font-medium p-1 border">
                                    <CalendarIcon className="h-3 w-3 inline mr-2" />
                                    {relativeDay(task.dueDate)}
                                </div>
                                <div className="text-xs flex items-center font-medium p-1 border">
                                    <TimerIcon className="h-3 w-3 inline mr-2" />
                                    {task.tomatoes}
                                </div>
                                {task.category && (
                                    <div className="text-xs flex items-center font-medium p-1 border">
                                        <TagIcon className="h-3 w-3 inline mr-2" />
                                        {task.category}
                                    </div>
                                )}
                            </div>
                        </article>
                    )}
                    {isShowMore && (
                        <TaskDetails closeTaskDetails={closeTaskDetails} task={task} />
                    )}

                    {showPomodoroTimer && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                { "h-0 w-0 overflow-hidden": !isShowTimer && isTimerRunning },
                            )}
                        >
                            <PomodorTimer
                                hideTimer={() => setIsShowTimer(false)}
                            />
                        </div>
                    )}
                </section>
                <section>
                    {!isShowTimer &&
                        (
                            <Button
                                onClick={onPlayClick}
                                className="p-2 border bg-orange-100 rounded-full hover:bg-orange-200"
                            >
                                {hasTimerTaskId
                                    ? <ClockIcon className="h-6 w-6 text-orange-500" />
                                    : <PlayIcon className="h-6 w-6 text-orange-500" />}
                            </Button>
                        )}
                </section>
            </li>
        </ResizablePanel>
    );
};

type PomodorTimerProps = {
    hideTimer: () => void;
};

const PomodorTimer = (
    { hideTimer }: PomodorTimerProps,
) => {
    const {
        isTimerRunning,
        isBreak,
        setIsBreak,
        minutes,
        seconds,
        resetTimer,
        startTimer,
        pauseTimer,
        stopTimer,
        restartTimer,
        timeLeft,
    } = usePomodoroState();

    const onPomoDoroClick = () => {
        if (!isBreak) return;
        setIsBreak(false);
        restartTimer(25);
    };

    const onBreakClick = () => {
        if (isBreak) return;
        setIsBreak(true);
        restartTimer(5);
    };
    const t = isBreak ? 5 : 25;

    const progressInPercent = ((t * 60 - timeLeft) / (t * 60)) * 100;

    return (
        <article
            className="bg-white p-2 sm:flex relative z-10 rounded mt-2.5"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-[12.5rem] relative mx-auto  p-1 rounded">
                <div className="text-xs divide-x-2  mb-5 uppercase font-semibold">
                    <span
                        onClick={onPomoDoroClick}
                        className={cn("px-2.5 text-gray-500", {
                            "text-orange-500": !isBreak,
                        })}
                    >
                        Pomodoro
                    </span>

                    <span
                        onClick={onBreakClick}
                        className={cn("px-2.5 text-gray-500", {
                            "text-orange-500": isBreak,
                        })}
                    >
                        Short Break
                    </span>
                </div>

                <div className="relative">
                    <span className="absolute inset-0 grid place-content-center text-3xl font-semibold">
                        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10
                            ? `0${seconds}`
                            : seconds}
                    </span>
                    <Circle
                        percent={progressInPercent}
                        strokeWidth={4}
                        strokeColor="#fb923c"
                        trailWidth={4}
                        trailColor="#fff7ed"
                    />
                </div>
            </div>
            <div className="flex flex-col w-[140px] mx-auto justify-center mt-5 gap-2.5">
                <div className="flex gap-2 5 justify-center">
                    <Button
                        onClick={resetTimer}
                        className="p-2 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                        <StopIcon className="w-6 h-6 text-orange-500" />
                    </Button>

                    <Button
                        onClick={() => {
                            hideTimer();
                            stopTimer();
                        }}
                        className="p-2 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                        <XMarkIcon className="w-6 h-6 text-orange-500" />
                    </Button>

                    <Button
                        onClick={hideTimer}
                        className="p-2 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                        <ChevronUpIcon className="w-6 h-6 text-orange-500" />
                    </Button>
                </div>
                {isTimerRunning
                    ? (
                        <Button
                            className="bg-orange-500 p-2 flex-shrink-0 rounded-full hover:bg-orange-500/80"
                            onClick={pauseTimer}
                        >
                            <PauseIcon className="h-6 w-6 text-white" />
                        </Button>
                    )
                    : (
                        <Button
                            className="bg-orange-500 p-2 flex-shrink-0 rounded-full hover:bg-orange-500/80"
                            onClick={startTimer}
                        >
                            <PlayIcon className="h-6 w-6 text-white" />
                        </Button>
                    )}
            </div>
        </article>
    );
};

type TaskDetailsProps = {
    task: Task;
    closeTaskDetails: () => void;
};

const TaskDetails = ({ task, closeTaskDetails }: TaskDetailsProps) => {
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
              void  apiContext.task.getAll.invalidate();
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
                  void  apiContext.task.getAll.invalidate();
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
                <Button variant="destructive" onClick={deleteTaskHandler} size="sm">
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

export default Tasklist;
