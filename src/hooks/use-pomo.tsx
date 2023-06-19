import { useCallback, useEffect, useState } from "react";

function showNotification(message: string) {
    void Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
            new Notification("To-Do Pomo", {
                body: message,
                icon: "/favicon.ico",
            });
        }
    });
}

export type SessionType = "work" | "break" | "longBreak";

const usePomodoro = ({ onComplete }: { onComplete: () => void }) => {
    const [sessionType, setSessionType] = useState<SessionType>("work");
    const [time, setTime] = useState(25 * 60); // Initial time set to 25 minutes
    const [timerTaskId, setTimerTaskId] = useState<string | null>(null);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const handleSessionComplete = useCallback(() => {
        if (sessionType === "work") {
            onComplete();
            showNotification("Time for a break!");
            if (sessionsCompleted === 3) {
                setSessionType("longBreak");
                setTime(15 * 60); // Long break set to 15 minutes
                setSessionsCompleted(0);
            } else {
                setSessionType("break");
                setTime(5 * 60); // Break set to 5 minutes
                setSessionsCompleted((prevSessionsCompleted) =>
                    prevSessionsCompleted + 1
                );
            }
        } else {
            showNotification("Time to get back to work!");
            setSessionType("work");
            setTime(25 * 60); // Work session set to 25 minutes
        }
    }, [onComplete, sessionsCompleted, sessionType]);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        if (isRunning) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (time === 0) {
            clearInterval(timer);
            handleSessionComplete();
        }

        return () => clearInterval(timer);
    }, [time, isRunning, handleSessionComplete]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")
            }`;
    };

    const getProgress = () => {
        if (sessionType === "work") {
            return ((25 * 60 - time) / (25 * 60)) * 100;
        } else if (sessionType === "break") {
            return ((5 * 60 - time) / (5 * 60)) * 100;
        } else if (sessionType === "longBreak") {
            return ((15 * 60 - time) / (15 * 60)) * 100;
        }
        return 0;
    };

    const reset = () => {
        setSessionType("work");
        setTime(25 * 60);
        setSessionsCompleted(0);
        setIsRunning(false);
    };

    const stop = () => {
        setSessionType("work");
        setTime(25 * 60);
        setSessionsCompleted(0);
        setIsRunning(false);
        setTimerTaskId(null);
    };

    const pause = () => {
        setIsRunning(false);
    };
    const resume = () => {
        setIsRunning(true);
    };

    const start = (taskId: string) => {
        setIsRunning(true);
        setTimerTaskId(taskId);
    };

    return {
        timerTaskId,
        resume,
        isRunning,
        sessionType,
        time,
        formatTime,
        progress: getProgress(),
        reset,
        stop,
        pause,
        start,
    };
};

export default usePomodoro;
