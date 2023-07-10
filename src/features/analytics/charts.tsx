import dayjs from "dayjs";
import { type RouterOutputs } from "~/utils/api";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    type ChartData,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { dateRangeArray, getChartOptions } from "~/utils/helper";

ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

type Task = RouterOutputs["task"]["getAll"][number];

type ChartTemplateProps = {
    dates: string[];
    tasks: Task[];
};

const ChartTemplate = ({ dates, tasks }: ChartTemplateProps) => {
    const formateDates = dates.map((day) => dayjs(day).format("MMM D"));
    const taskCompletedOnThatDay = (day: string, tasks: Task[]) => {
        console.log(day, "inside task completed");
        return tasks.filter((task) => dayjs(task.completedAt).isSame(day, "day"))
            .length;
    };

    const max = useMemo(() => {
        const max = Math.max(
            ...dates.map((day) => taskCompletedOnThatDay(day, tasks)),
        );
        return max + 2;
    }, [tasks, dates]);

    const options = getChartOptions(max);

    const data: ChartData<"bar"> = {
        labels: formateDates,
        datasets: [
            {
                label: "Tasks Completed",
                data: dates.map((day) => taskCompletedOnThatDay(day, tasks)),
                backgroundColor: "#fb923c",
                borderRadius:4,
            },
        ],
    };

    return (
        <article className="rounded bg-white sm:p-5">
            <Bar height={"220"}  data={data} options={options} />
        </article>
    );
};

export const LastWeekChart = ({ tasks }: { tasks: Task[] }) => {
    const lastWeek = dateRangeArray(dayjs().subtract(6, "day"), new Date());

    return <ChartTemplate dates={lastWeek} tasks={tasks} />;
};

export const LastMonthChart = ({ tasks }: { tasks: Task[] }) => {
    const lastMonth = dateRangeArray(dayjs().subtract(29, "day"), new Date());
    return <ChartTemplate dates={lastMonth} tasks={tasks} />;
};
