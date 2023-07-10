import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, TagIcon, TimerIcon } from "lucide-react";
import { api, type RouterOutputs } from "~/utils/api";
import { useEffect, useState } from "react";

import { ClockIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/20/solid";
import { relativeDay } from "~/utils/helper";
import { usePomodoroState } from "~/context/global";
import { Button } from "~/components/ui/button";
import ResizablePanel from "~/components/ResizablePanel";
import { EditTask } from "./edit-task";
import { PomodorTimer } from "./pomodoro-timer";
import clsx from "clsx";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

type Task = RouterOutputs["task"]["getAll"][number];

export const SingleTask = ({ task }: { task: Task }) => {
    const [isEditTask, setIsEditTask] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(false);
    const apiContext = api.useContext();
    const {
        isTimerRunning,
        timerTaskId,
        start,
        reset,
        updateSessionToComplete,
    } = usePomodoroState();

    const toggleStatus = api.task.toggleStatus.useMutation({
        onMutate: async ({ taskId }) => {
            await apiContext.task.getAll.cancel();
            const prevData = apiContext.task.getAll.getData();
            if (!prevData) return { prevData: undefined };
            const oldTask = prevData.find((t) => t.id === taskId);
            const newTask = { ...oldTask, done: !oldTask?.done };
            apiContext.task.getAll.setData(undefined, (old) => {
                if (!old) return old;
                return old.map((t) => (t.id === taskId ? newTask : t));
            });
            return { prevData };
        },
        onError(error, variables, context) {
            if (context?.prevData) {
                apiContext.task.getAll.setData(undefined, context.prevData);
            }
        },
    });
    const onCheckboxChange = () => {
        toggleStatus.mutate({
            taskId: task.id,
        });
    };

    const onPlayClick = () => {
        setIsShowTimer(!isShowTimer);
        setIsEditTask(false);
        const isCurrentTask = timerTaskId === task.id;

        if (!isTimerRunning && !isCurrentTask) {
            updateSessionToComplete(task.tomatoes_to_complete);
            start(task.id);
        }

        if (isTimerRunning && !isCurrentTask) {
            reset();
            updateSessionToComplete(task.tomatoes_to_complete);
            start(task.id);
        }
    };

    const closeTaskDetails = () => setIsEditTask(false);
    const openTaskDetails = () => {
        setIsShowTimer(false);
        setIsEditTask(true);
    };

    const hasTimerTaskId = timerTaskId === task.id;
    const showPomodoroTimer = (!isEditTask && isShowTimer) && hasTimerTaskId;

    useEffect(() => {
        console.log(`runing for ${task.id}`);
        if (!hasTimerTaskId) {
            setIsShowTimer(false);
        }
    }, [setIsShowTimer, hasTimerTaskId]);

    return (
        <ResizablePanel>
            <li className="border w-full flex gap-2.5 items-start rounded  p-2 bg-zinc-50">
                <Checkbox
                    className={cn("rounded-full h-5 w-5 transition-colors", {
                        "mt-1": !isEditTask,
                        "mt-2.5": isEditTask,
                    })}
                    onCheckedChange={onCheckboxChange}
                    checked={task.done}
                />
                <section className={cn("cursor-pointer flex-1 select-none")}>
                    {!isEditTask && (
                        <article
                            onClick={openTaskDetails}
                            className={cn({
                                "opacity-50 transition-colors duration-500": task.done,
                            })}
                        >
                            <div
                                className={clsx("transition-colors duration-500", {
                                    "line-through text-gray-500": task.done,
                                })}
                            >
                                {task.title}
                            </div>
                            {!isShowTimer && (
                                <div className="flex flex-wrap gap-2 text-gray-500">
                                    <div className="text-xs rounded p-1 capitalize font-medium bg-white  border">
                                        <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
                                        {task.priority?.toLowerCase()}
                                    </div>
                                    <div className="text-xs flex rounded items-center bg-white font-medium p-1 border">
                                        <CalendarIcon className="h-3 w-3 inline mr-1" />
                                        {relativeDay(task.dueDate)}
                                    </div>
                                    <div className="text-xs flex rounded items-center bg-white font-medium p-1 border">
                                        <TimerIcon className="h-3 w-3 inline mr-1" />
                                        {task.tomatoes}/{task.tomatoes_to_complete}
                                    </div>
                                    {task.category && (
                                        <div className="text-xs flex rounded bg-white items-center font-medium p-1 border">
                                            <TagIcon className="h-3 w-3 inline mr-1" />
                                            {task.category}
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    )}
                    {isEditTask && (
                        <EditTask closeTaskDetails={closeTaskDetails} task={task} />
                    )}

                    {showPomodoroTimer && (
                        <PomodorTimer
                            hideTimer={() => setIsShowTimer(false)}
                        />
                    )}
                </section>
                <section className=" my-auto">
                    {(!isEditTask && !showPomodoroTimer) &&
                        (
                            <Button
                                disabled={task.done}
                                onClick={onPlayClick}
                                className="p-2 border bg-orange-50 flex-shrink-0 aspect-square rounded-full hover:bg-orange-100"
                            >
                                {hasTimerTaskId
                                    ? <ClockIcon className="h-5 w-5 text-orange-400" />
                                    : <PlayIcon className="h-5 w-5 text-orange-400" />}
                            </Button>
                        )}
                </section>
            </li>
        </ResizablePanel>
    );
};


