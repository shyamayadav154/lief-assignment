import { cn } from "~/lib/utils";
import {
    ChevronUpIcon,
    PauseIcon,
    PlayIcon,
    StopIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { usePomodoroState } from "~/context/global";
import { Button } from "~/components/ui/button";
import { Circle } from "rc-progress";

type PomodorTimerProps = {
    hideTimer: () => void;
};

export const PomodorTimer = (
    { hideTimer }: PomodorTimerProps,
) => {
    const {
        isTimerRunning,
        sessionType,
        formatTime,
        time,
        pause,
        reset,
        resume,
        stop,
        progress,
    } = usePomodoroState();

    return (
        <article
            className="bg-white p-2 sm:flex relative z-10 rounded mt-2.5 cursor-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col items-center  relative mx-auto  p-1 rounded">
                <div className="text-xs divide-x-2  mb-5 uppercase font-semibold">
                    <span
                        className={cn("px-2.5 text-gray-500", {
                            "text-orange-500": sessionType === "work",
                        })}
                    >
                        Pomodoro
                    </span>

                    <span
                        className={cn("px-2.5 text-gray-500", {
                            "text-orange-500": sessionType === "break",
                        })}
                    >
                        Short Break
                    </span>

                    <span
                        className={cn("px-2.5 text-gray-500", {
                            "text-orange-500": sessionType === "longBreak",
                        })}
                    >
                        Long Break
                    </span>
                </div>

                <div className="relative w-[12.5rem]">
                    <span className="absolute inset-0 grid place-content-center text-3xl font-semibold">
                        {formatTime(time)}
                    </span>
                    <Circle
                        percent={progress}
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
                        onClick={reset}
                        className="p-2 rounded-full bg-orange-100 hover:bg-orange-200"
                    >
                        <StopIcon className="w-6 h-6 text-orange-500" />
                    </Button>

                    <Button
                        onClick={() => {
                            hideTimer();
                            stop();
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
                            onClick={pause}
                        >
                            <PauseIcon className="h-6 w-6 text-white" />
                        </Button>
                    )
                    : (
                        <Button
                            className="bg-orange-500 p-2 flex-shrink-0 rounded-full hover:bg-orange-500/80"
                            onClick={resume}
                        >
                            <PlayIcon className="h-6 w-6 text-white" />
                        </Button>
                    )}
            </div>
        </article>
    );
};
