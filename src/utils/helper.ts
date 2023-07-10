import { differenceInDays, format } from "date-fns";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { type ChartOptions } from "chart.js";
dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);

export function relativeDay(date: Date | null) {
    if (date == null) return null;
    const today = new Date();
    const difference = differenceInDays(date, today);
    if (difference === 0) {
        return "Today";
    } else if (difference === 1) {
        return "Tomorrow";
    } else if (difference === -1) {
        return "Yesterday";
    } else {
        return format(date, "d MMMM");
    }
}

export function dateRangeArray(startDate = dayjs(), endDate: Date) {
    let start = dayjs(startDate);
    const end = dayjs(endDate);
    const arr = [];
    while (start.isSameOrBefore(end)) {
        arr.push(start.format("YYYY-MM-DD"));
        start = start.add(1, "day");
    }
    return arr;
}

export const getChartOptions = (max: number): ChartOptions<"bar"> => ({
    responsive: true,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            max,
            grid: {
                display: true,
            },
            ticks: {
                callback: (value) => value,
                stepSize: 1,
            },
        },
    },

    plugins: {
        datalabels: {
            display: true,
            color: "black",
            formatter: (value) => {
                if (value == 0) return null;
                return value as number;
            },
            anchor: "end",
            offset: -20,
            align: "start",
        },
        legend: {
            position: "top" as const,
        },
    },
});
