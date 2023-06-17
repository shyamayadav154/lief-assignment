import dayjs from "dayjs";
import { type RouterOutputs } from "~/utils/api";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    type ChartData,
    type ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);
dayjs.extend(isToday);
dayjs.extend(isSameOrBefore);

type Task = RouterOutputs["task"]["getAll"][number];

function dateRangeArray(startDate = dayjs(), endDate: Date) {
    let start = dayjs(startDate);
    const end = dayjs(endDate);
    const arr = [];
    while (start.isSameOrBefore(end)) {
        arr.push(start.format("YYYY-MM-DD"));
        start = start.add(1, "day");
    }
    return arr;
}

const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
        y: {
            ticks: {
                callback: (value) => value,
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
};

export const LastWeekChart = ({ tasks }: { tasks: Task[] }) => {
    const lastWeek = dateRangeArray(dayjs().subtract(6, "day"), new Date());
    const lastWeekFormated = lastWeek.map((day) => dayjs(day).format("MMM D"));

    const taskCompletedOnThatDay = (day: string, tasks: Task[]) => {
        console.log(day, "inside task completed");
        return tasks.filter((task) => dayjs(task.completedAt).isSame(day, "day"))
            .length;
    };

    console.log({
        lastWeek,
    });

    const data: ChartData<"bar"> = {
        labels: lastWeekFormated,
        datasets: [
            {
                label: "Tasks Completed",
                data: lastWeek.map((day) => taskCompletedOnThatDay(day, tasks)),
                backgroundColor: "#fb923c",
            },
        ],
    };

    return (
        <article className="rounded bg-white p-5">
            <Bar data={data} options={options} />
        </article>
    );
};

export const LastMonthChart = ({ tasks }: { tasks: Task[] }) => {
    const lastMonth = dateRangeArray(dayjs().subtract(29, "day"), new Date());
    const lastMonthFormated = lastMonth.map((day) => dayjs(day).format("MMM D"));

    const taskCompletedOnThatDay = (day: string, tasks: Task[]) => {
        return tasks.filter((task) => dayjs(task.completedAt).isSame(day, "day"))
            .length;
    };

    console.log({
        lastMonth,
    });

    const data: ChartData<"bar"> = {
        labels: lastMonthFormated,
        datasets: [
            {
                label: "Tasks Completed",
                data: lastMonth.map((day) => taskCompletedOnThatDay(day, tasks)),
                backgroundColor: "#fb923c",
            },
        ],
    };

    return (
        <article className="rounded bg-white p-5">
            <Bar data={data} options={options} />
        </article>
    );
};
