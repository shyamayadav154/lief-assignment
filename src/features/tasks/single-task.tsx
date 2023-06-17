import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, TagIcon, TimerIcon } from "lucide-react";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";

import { ClockIcon } from "@heroicons/react/24/outline";
import { cn } from "~/lib/utils";
import {
    PlayIcon,
} from "@heroicons/react/20/solid";
import { relativeDay } from "~/utils/helper";
import { usePomodoroState } from "~/context/global";
import { Button } from "~/components/ui/button";
import ResizablePanel from "~/components/ResizablePanel";
import { EditTask } from "./edit-task";
import { PomodorTimer } from "./pomodoro-timer";

type Task = RouterOutputs["task"]["getAll"][number];

export const SingleTask = ({ task }: { task: Task }) => {
    const [isShowMore, setIsShowMore] = useState(false);
    const [isShowTimer, setIsShowTimer] = useState(false);
    const {
        isTimerRunning,
        restartTimer,
        setIsTimerRunning,
        setTimerTaskId,
        timerTaskId,
    } = usePomodoroState();

    const onPlayClick = () => {
        setIsShowTimer(!isShowTimer);
        setIsShowMore(false);

        if (!isTimerRunning) {
            setIsTimerRunning(true);
            setTimerTaskId(task.id);
            return;
        }

        if (isTimerRunning) {
            if (timerTaskId === task.id) {
                setIsShowTimer(true);
            } else {
                setIsTimerRunning(true);
                setIsShowTimer(true);
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

    const hasTimerTaskId = timerTaskId === task.id;
    const showPomodoroTimer = (!isShowMore && isShowTimer) && hasTimerTaskId;

    return (
        <ResizablePanel>
            <li className="border w-full flex gap-2.5 items-start rounded  p-2 bg-gray-50">
                <TaskCheckBox taskId={task.id} isChecked={task.done} />
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
                        <EditTask closeTaskDetails={closeTaskDetails} task={task} />
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
                    { (!isShowTimer || task.id !== timerTaskId) &&
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
