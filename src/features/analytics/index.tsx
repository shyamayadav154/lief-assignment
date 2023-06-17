import { api } from "~/utils/api";
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
import { MonthStats, TodayStats, WeekStats } from "./stats";
import { StatsCards } from "./stats";

ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const Analytics = () => {
    const apiContext = api.useContext();
    const tasks = apiContext.task.getAll.getData();

    if (!tasks?.length) {
        return (
            <p className="text-gray-500">
                No tasks found, add some task to see analytics
            </p>
        );
    }

    return (
        <section>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <StatsCards tasks={tasks} />
            <TodayStats tasks={tasks} />
            <WeekStats tasks={tasks} />
            <MonthStats tasks={tasks} />
        </section>
    );
};

export default Analytics;
