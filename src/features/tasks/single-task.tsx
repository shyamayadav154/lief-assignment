import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, TagIcon, TimerIcon } from "lucide-react";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";

import { ClockIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/20/solid";
import { relativeDay } from "~/utils/helper";
import { usePomodoroState } from "~/context/global";
import { Button } from "~/components/ui/button";
import ResizablePanel from "~/components/ResizablePanel";
import { EditTask } from "./edit-task";
import { PomodorTimer } from "./pomodoro-timer";

type Task = RouterOutputs["task"]["getAll"][number];

export const SingleTask = ({ task }: { task: Task }) => {
    const [isEditTask, setIsEditTask] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(false);
    const {
        isTimerRunning,
        timerTaskId,
        start,
        reset,
    } = usePomodoroState();

    const onPlayClick = () => {
        setIsShowTimer(!isShowTimer);
        setIsEditTask(false);
        const isCurrentTask = timerTaskId === task.id;

        if (!isTimerRunning && !isCurrentTask) {
            start(task.id);
        }

        if (isTimerRunning && !isCurrentTask) {
            reset();
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

    return (
        <ResizablePanel>
            <li className="border w-full flex gap-2.5 items-start rounded  p-2 bg-zinc-50">
                <TaskCheckBox taskId={task.id} isChecked={task.done} />
                <section className="cursor-pointer flex-1 select-none">
                    {!isEditTask && (
                        <article
                            onClick={openTaskDetails}
                        >
                            <div className="">
                                {task.title}
                            </div>
                            {!isShowTimer && (
                                <div className="flex gap-2 text-gray-500">
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
                                        {task.tomatoes}
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

const TaskCheckBox = (
    { isChecked, taskId }: { isChecked: boolean; taskId: string },
) => {
    const toggleStatus = api.task.toggleStatus.useMutation();
    const apiContext = api.useContext();

    const onCheckboxChange = () => {
        toggleStatus.mutate({ taskId }, {
            onSuccess: () => {
                void apiContext.task.getAll.invalidate();
            },
        });
    };
    return (
        <section className="mt-1.5">
            <input
                onChange={onCheckboxChange}
                className="h-4 w-4"
                type="checkbox"
                defaultChecked={isChecked}
            />
        </section>
    );
};
