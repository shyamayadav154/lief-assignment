import CreateTask from "./create-task";
import Tasklist from "./task-list";

const Tasks = () => {
    return (
        <section>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <section className="space-y-5 mt-2.5 ">
                <CreateTask />
                <Tasklist />
            </section>
        </section>
    );
};

export default Tasks;
