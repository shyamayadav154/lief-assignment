import dayjs from "dayjs";
import { Line } from "rc-progress";
import { type RouterOutputs } from "~/utils/api";
import isToday from "dayjs/plugin/isToday";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { LastMonthChart, LastWeekChart } from "./charts";

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

export const TodayStats = ({ tasks }: { tasks: Task[] }) => {
    const tasksCompletedToday = tasks.filter((task) =>
        dayjs(task.completedAt).isToday()
    );

    const totalTomatoes = tasksCompletedToday.reduce(
        (acc, task) => acc + task.tomatoes,
        0,
    );

    const pomoTime = totalTomatoes * 30;
    const pomoTimeInHours = Math.floor(pomoTime / 60);
    const pomoTimeInMinutes = pomoTime % 60;

    console.log({
        tasksCompletedToday,
        totalTomatoes,
    });

    return (
        <article className="   mt-5   rounded">
            <h1 className="text-lg font-medium">Today</h1>
            <section className="rounded bg-white p-5">
                <dl className=" grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <SingleStateCard name="Done" stat={tasksCompletedToday.length} />
                    <SingleStateCard name="Tomatoes" stat={totalTomatoes} />

                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Focus Time
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {pomoTimeInHours}
                            <span className="text-base">h</span>
                            &nbsp;
                            {pomoTimeInMinutes}
                            <span className="text-base">m</span>
                        </dd>
                    </div>
                </dl>
            </section>
        </article>
    );
};

export const MonthStats = ({ tasks }: { tasks: Task[] }) => {
    const tasksCompletedThisMonth = tasks.filter((task) =>
        dayjs(task.completedAt).isAfter(dayjs().subtract(30, "day"))
    );

    const totalTomatoes = tasksCompletedThisMonth.reduce(
        (acc, task) => acc + task.tomatoes,
        0,
    );

    const pomoTime = totalTomatoes * 30;
    const pomoTimeInHours = Math.floor(pomoTime / 60);
    const pomoTimeInMinutes = pomoTime % 60;

    return (
        <article className="mt-5  rounded">
            <h1 className="text-lg font-medium">Last Month</h1>
            <section className="rounded bg-white p-5">
                <dl className=" grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <SingleStateCard name="Done" stat={tasksCompletedThisMonth.length} />
                    <SingleStateCard name="Tomatoes" stat={totalTomatoes} />
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Focus Time
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {pomoTimeInHours}
                            <span className="text-base">h</span>
                            &nbsp;
                            {pomoTimeInMinutes}
                            <span className="text-base">m</span>
                        </dd>
                    </div>
                </dl>
                <LastMonthChart tasks={tasks} />
            </section>
        </article>
    );
};

export const WeekStats = ({ tasks }: { tasks: Task[] }) => {
    const tasksCompletedThisWeek = tasks.filter((task) =>
        dayjs(task.completedAt).isAfter(dayjs().subtract(7, "day"))
    );

    const totalTomatoes = tasksCompletedThisWeek.reduce(
        (acc, task) => acc + task.tomatoes,
        0,
    );

    const pomoTime = totalTomatoes * 30;
    const pomoTimeInHours = Math.floor(pomoTime / 60);
    const pomoTimeInMinutes = pomoTime % 60;

    return (
        <article className="mt-5  rounded">
            <h1 className="text-lg font-medium">Last Week</h1>
            <section className="rounded bg-white p-5">
                <dl className=" grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <SingleStateCard name="Done" stat={tasksCompletedThisWeek.length} />
                    <SingleStateCard name="Tomatoes" stat={totalTomatoes} />
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Focus Time
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {pomoTimeInHours}
                            <span className="text-base">h</span>
                            &nbsp;
                            {pomoTimeInMinutes}
                            <span className="text-base">m</span>
                        </dd>
                    </div>
                </dl>
                <LastWeekChart tasks={tasks} />
            </section>
        </article>
    );
};

const lineColor = (percent: number) => {
    if (percent < 50) return "#F87171";
    if (percent < 75) return "#FBBF24";
    if (percent < 100) return "#4ade80";
    return "#22c55e";
};

type SingleStateCardProps = {
    name: string;
    stat: number;
};

export const SingleStateCard = ({ name, stat }: SingleStateCardProps) => {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {stat}
            </dd>
        </div>
    );
};
export const StatsCards = ({ tasks }: { tasks: Task[] }) => {
    const totalTasks = tasks.length - 1;
    const completedTasks = tasks.filter((task) => task.done).length;
    const activeTasks = totalTasks - completedTasks;
    const avgCompletionPercent = (completedTasks / totalTasks) * 100;

    return (
        <article className=" mt-5 ">
            <h1 className="text-lg font-medium">Overview</h1>
            <section className="space-y-5 rounded bg-white p-5">
                <div className="">
                    <div className="flex items-center justify-between">
                        <h3 className="mb-1 text-base font-semibold leading-6 text-gray-900">
                            Task Completed
                        </h3>
                        <div>
                            <span className="text-2xl font-medium">
                                {avgCompletionPercent.toFixed(0)}
                            </span>
                            <span className="text-sm text-gray-500">%</span>
                        </div>
                    </div>
                    <Line
                        strokeColor={lineColor(avgCompletionPercent)}
                        percent={avgCompletionPercent}
                        strokeWidth={2}
                        trailWidth={2}
                    />
                </div>
                <dl className=" grid grid-cols-1  gap-5 sm:grid-cols-3">
                    <SingleStateCard name="Active Tasks" stat={activeTasks} />
                    <SingleStateCard name="Completed Tasks" stat={completedTasks} />
                    <SingleStateCard name="Total Tasks" stat={totalTasks} />
                </dl>
            </section>
        </article>
    );
};
