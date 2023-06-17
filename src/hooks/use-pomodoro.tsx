import type React from "react";
import { useEffect, useState } from "react";

type UsePomodorProps = {
    setTimerTaskId: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    onTimesUp: () => void;
    taskId: string | null;
};
function usePomodoro(
    { setTimerTaskId, onTimesUp }: UsePomodorProps,
) {
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Initial time in seconds
    const [isBreak, setIsBreak] = useState(false);
    const timerValue = isBreak ? 5 : 25;
    const progressInPercent = ((timerValue * 60 - timeLeft) / (timerValue * 60)) *
        100;

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
            if (isBreak) return;
            setIsBreak(true);
            restartTimer(5);
            onTimesUp();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft, isBreak, onTimesUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const stopTimer = () => {
        setTimeLeft(25 * 60);
        setTimerTaskId(null);
        setIsBreak(false);
    };

    const resetTimer = () => {
        setTimeLeft(timerValue * 60);
        setIsRunning(false);
    };

    const restartTimer = (value: number | undefined) => {
        if (!value) {
            setTimeLeft(25 * 60);
            setIsRunning(true);
        }
        if (value) {
            setTimeLeft(value * 60);
            setIsRunning(true);
        }
    };

    return {
        isRunning,
        setIsRunning,
        isBreak,
        setIsBreak,
        progressInPercent,
        restartTimer,
        startTimer,
        pauseTimer,
        stopTimer,
        resetTimer,
        minutes,
        seconds,
        timeLeft,
    };
}

export default usePomodoro;
