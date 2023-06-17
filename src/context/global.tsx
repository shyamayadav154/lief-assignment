import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useState,
    type Context,
} from "react";
import usePomodoro from "~/hooks/use-pomodoro";
import { api } from "~/utils/api";

type PomodoroContextType = {
    isBreak: boolean;
    setIsBreak: Dispatch<SetStateAction<boolean>>;
    isTimerRunning: boolean;
    setIsTimerRunning: Dispatch<SetStateAction<boolean>>;
    timerTaskId: string | null;
    setTimerTaskId: Dispatch<SetStateAction<string | null>>;
    minutes: number;
    seconds: number;
    resetTimer: () => void;
    timeLeft: number;
    startTimer: () => void;
    stopTimer: () => void;
    restartTimer: (value: number | undefined) => void;
    pauseTimer: () => void;
    progressInPercent: number;
};

export const PomodoroContext = createContext<PomodoroContextType | null>(null);

export const PomodoroContextProvider = (
    { children }: { children: ReactNode },
) => {
    // const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
    const addTomatoApi = api.task.addTomato.useMutation();
    const apiContext = api.useContext();

    const onTimesUp = () => {
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
        isRunning,
        setIsRunning,
        isBreak,
        setIsBreak,
        timeLeft,
        minutes,
        seconds,
        resetTimer,
        startTimer,
        stopTimer,
        pauseTimer,
        restartTimer,
        progressInPercent,
    } = usePomodoro({
        setTimerTaskId,
        onTimesUp,
        taskId: timerTaskId,
    });

    const contextValue: PomodoroContextType = {
        isBreak,
        setIsBreak,
        timeLeft,
        timerTaskId,
        setTimerTaskId,
        isTimerRunning: isRunning,
        setIsTimerRunning: setIsRunning,
        minutes,
        seconds,
        resetTimer,
        restartTimer,
        pauseTimer,
        startTimer,
        stopTimer,
        progressInPercent,
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
    useContext<PomodoroContextType>(PomodoroContext as unknown as Context<PomodoroContextType>);
