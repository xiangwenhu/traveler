import TasksManager from "./TasksManager";
import { DEFAULT_OPTIONS } from "./const";
import { CommonTask, ManagerOptions, TaskResult } from "./types";

export default class AsyncTasksManager extends TasksManager {
    constructor(tasks: CommonTask[], options: ManagerOptions = DEFAULT_OPTIONS) {
        super(tasks, options);
    }

    startPromise<R = any>(options: ManagerOptions = {}): Promise<TaskResult<R>[]> {

        return new Promise((resolve, reject) => {
            const results: TaskResult<R>[] = [];

            function onTaskComplete(task: CommonTask, result: R) {
                results.push({
                    success: true,
                    id: task.id,
                    name: task.name,
                    result: result,
                    extra: task.extra
                })
            }

            function onTaskError(task: CommonTask, error: any) {
                results.push({
                    success: false,
                    id: task.id,
                    name: task.name,
                    error: error && error.message,
                    extra: task.extra
                })
            }

            // const onCancel = () => {
            //     reject(new Error("cancelled"))
            // }

            const onComplete = () => {
                resolve(results);
                super.off("taskError", onTaskError);
                super.off("taskComplete", onComplete);
                super.off("complete", onComplete);
            }

            super
                .onTaskComplete(onTaskComplete)
                .onTaskError(onTaskError)
                .onComplete(onComplete)
                // .onCancel(onCancel)
                .start(options);
        })
    }

}