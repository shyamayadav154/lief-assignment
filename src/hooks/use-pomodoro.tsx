import React, { useEffect, useState } from "react";

type UsePomodorProps = {
    isRunning: boolean;
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    onTimesUp: () => void;
};
function usePomodoro({ isRunning, setIsRunning, onTimesUp }: UsePomodorProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Initial time in seconds

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            onTimesUp();
            clearInterval(timer);
        }
        return () => clearInterval(timer!);
    }, [isRunning, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const startTimer = () => {
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setTimeLeft(25 * 60);
        setIsRunning(false);
    };
    const progressInPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    return {
        progressInPercent,
        startTimer,
        stopTimer,
        resetTimer,
        minutes,
        seconds,
    };
}

export default usePomodoro;
