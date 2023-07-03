import {
    type Context,
    createContext,
    type ReactNode,
    useContext,
    useState,
} from "react";
import { api } from "~/utils/api";
import usePomo, { type SessionType } from "~/hooks/use-pomo";

type PomodoroContextType = {
    sessionType: SessionType;
    isTimerRunning: boolean;
    timerTaskId: string | null;
    reset: () => void;
    resume: () => void;
    formatTime: (time: number) => string;
    time: number;
    start: (taskId: string) => void;
    stop: () => void;
    pause: () => void;
    progress: number;
    sessionToComplete: number;
    updateSessionToComplete: (value: number) => void;
    sessionsCompleted: number;
};

export const PomodoroContext = createContext<PomodoroContextType | null>(null);

export const PomodoroContextProvider = (
    { children }: { children: ReactNode },
) => {
    const [sessionToComplete, setSessionToComplete] = useState(3);
    const addTomatoApi = api.task.addTomato.useMutation();
    const apiContext = api.useContext();

    const updateSessionToComplete = (value: number) => {
        setSessionToComplete(value);
    };

    const onComplete = () => {
        if (!timerTaskId) return alert("task id not found");
        addTomatoApi.mutate({
            taskId: timerTaskId,
        }, {
            onError(error) {
                console.log(error);
                alert("something went wrong in add tomato mutation");
            },
            onSuccess: () => {
                void apiContext.task.getAll.invalidate();
            },
        });
    };

    const {
        formatTime,
        isRunning,
        time,
        start,
        stop,
        reset,
        resume,
        pause,
        timerTaskId,
        sessionType,
        progress,
        sessionsCompleted,
    } = usePomo({ onComplete, sessionToComplete });

    const contextValue: PomodoroContextType = {
        stop,
        resume,
        reset,
        pause,
        progress,
        start,
        formatTime,
        time,
        sessionType,
        timerTaskId,
        isTimerRunning: isRunning,
        sessionToComplete,
        updateSessionToComplete,
        sessionsCompleted,
    };
    return (
        <PomodoroContext.Provider
            value={contextValue}
        >
            {children}
        </PomodoroContext.Provider>
    );
};

export const usePomodoroState = () =>
    useContext<PomodoroContextType>(
        PomodoroContext as unknown as Context<PomodoroContextType>,
    );
