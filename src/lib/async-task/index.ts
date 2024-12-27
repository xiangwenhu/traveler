import AsyncTasksManager from "./AsyncTasksManager";
import TasksManager from "./TasksManager";
import { CommonTask, ManagerOptions, TasksCreator } from "./types";
import { isFunction } from "./util";

export function create(createFn: TasksCreator |  CommonTask[], options: ManagerOptions): TasksManager {
    // @ts-ignore
    const tasks = isFunction(createFn) ? createFn() : createFn;
    const manager = new TasksManager(tasks,options);
    return manager;
}

export function createAsync(createFn: TasksCreator | CommonTask[], options: ManagerOptions): AsyncTasksManager {
    // @ts-ignore
    const tasks = isFunction(createFn) ? createFn() : createFn;
    const manager = new AsyncTasksManager(tasks, options);
    return manager;
}

