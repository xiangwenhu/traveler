import { CommonTask, EVENT_NAME, ManagerOptions, TaskCompleteFun, TaskErrorFun, TaskProgressFun, TaskResult, TasksCancelFun, TasksCompleteFun, TasksCreator } from "./types";
import * as util from "./util";
import { DEFAULT_OPTIONS } from "./const";
import { EventEmitter } from "events";

function getEventName(event: EVENT_NAME) {
    return "on" + util.firstToUpper(event);
}

export default class TasksManager {
    protected tasks: CommonTask[];
    protected options: ManagerOptions;
    protected workingTaskCount: number = 0;
    protected completedCount: number = 0;
    protected errorCount: number = 0;
    protected isRunning: boolean = false;
    protected emitter = new EventEmitter();

    protected workingTask: Map<string | number, CommonTask> = new Map();

    constructor(tasks: CommonTask[], options: ManagerOptions = DEFAULT_OPTIONS) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.tasks = [...tasks];
        this.isRunning = false;
    }

    /**
     * 添加任务
     * @param task
     */
    addTasks(tasks: CommonTask | CommonTask[]): void {
        if (!this.options.enableDisturb) {
            return;
        }
        const ts = Array.isArray(tasks) ? tasks : [tasks];
        this.tasks.push(...ts);
        if (!this.isRunning) {
            this.runNextTask();
        }
    }

    /**
     * 删除任务
     * @param taskId
     */
    delTask(taskId: string | number): void {
        if (!this.options.enableDisturb) {
            return;
        }
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
            this.tasks = this.tasks.splice(index, 1);
        }
    }

    start(options: ManagerOptions = {}): any {
        if (this.isRunning) {
            return Promise.reject(new Error("tasks is already running"));
        }
        if (this.tasks.length === 0) {
            return Promise.reject(new Error("tasks is empty"));
        }
        this.isRunning = true;
        this.options = Object.assign({}, this.options, options);
        this.runNextTask();
        // return this;
    }

    cancel(message?: string) {
        this.tasks = [];
        this.dispatch("cancel", message);
        if (!this.options.cancelWaitUntilAllTaskCompleted) {
            this.isRunning = false;
        }
    }

    private runNextTask() {
        // 没有任务
        if (this.tasks.length === 0) {
            return;
        }
        // 工作中的任务大于等于 并发数
        if (this.workingTaskCount >= this.options!.maxConcurrent!) {
            return;
        }
        const task = this.tasks.shift();
        this.doTask(task!);

        // 工作中的任务数量小于并发数
        if (this.workingTaskCount < this.options?.maxConcurrent!) {
            this._onProgress();
            this.runNextTask();
        }
    }

    protected doTask(task: CommonTask): void {
        try {
            this.workingTaskCount++;
            this.workingTask.set(task.id!, task);
            const promise = task.timeout || 0 > 0 ? new Promise((resolve, reject) => {
                const _ticket = setTimeout(() => reject(new Error(`${task.id} 超时`)), task.timeout);
                //@ts-ignore
                task.task.apply(task.context || null, task.args || []).then((res) => {
                    clearTimeout(_ticket);
                    resolve(res)
                }).catch(reject);
                //@ts-ignore
            }) : task.task.apply(task.context || null, task.args || []);

            promise.then(res => {
                this.workingTaskCount--;
                this.completedCount++;
                this.workingTask.delete(task.id!)
                this._onTaskComplete(task, res)
            })
                .catch(err => {
                    this.completedCount++;
                    this.workingTaskCount--;
                    this.errorCount++;
                    this.workingTask.delete(task.id!)
                    this._onTaskError(task, err)
                })
        } catch (err: any) {
            this.completedCount++;
            this.workingTaskCount--;
            this.errorCount++;
            this.workingTask.delete(task.id!)
            this._onTaskError(task, err);
        }
    }

    protected checkComplete() {
        if (this.tasks.length === 0 && this.workingTaskCount === 0) {
            this._onComplete();
            this.isRunning = false;
        }
    }

    public on(event: EVENT_NAME, fun: TaskErrorFun | TaskCompleteFun | TasksCompleteFun | TasksCancelFun | TaskProgressFun) {
        const eName = getEventName(event);
        this.emitter.on(eName, fun);
        return this;
    }

    public off(event: EVENT_NAME, fun: TaskErrorFun | TaskCompleteFun | TasksCompleteFun | TasksCancelFun | TaskProgressFun) {
        const eName = getEventName(event);
        this.emitter.off(eName, fun);
        return this;
    }

    onProgress(fun: TaskProgressFun) {
        return this.on("progress", fun);
    }

    onTaskError(fun: TaskErrorFun) {
        return this.on("taskError", fun);
    }

    onTaskComplete<R>(fun: TaskCompleteFun<R>) {
        return this.on("taskComplete", fun);
    }

    onComplete(fun: TaskCompleteFun) {
        return this.on("complete", fun);
    }

    onCancel(fun: TasksCancelFun) {
        return this.on("cancel", fun);
    }

    protected dispatch(event: EVENT_NAME, ...args: any[]) {
        const eName = getEventName(event);
        this.emitter.emit(eName, ...args);
    }

    protected _onProgress() {
        const leftCount = this.tasks.length;
        const { workingTaskCount, completedCount, errorCount } = this;
        this.dispatch("progress", {
            leftCount, workingTaskCount, completedCount, errorCount
        }, Array.from(this.workingTask.values()).map(v => {
            const { task, ...data } = v;
            return data
        }))
        this.checkComplete();
    }

    protected _onTaskError(task: CommonTask, err: Error): void {
        this.dispatch("taskError", task, err);
        if (this.options.cancelOnTaskError === true) {
            this.cancel();
        } else {
            this.runNextTask();
        }
        this._onProgress();
    }

    protected _onTaskComplete(task: CommonTask, result: any) {
        this.dispatch("taskComplete", task, result);
        this.runNextTask();
        this._onProgress();
    }

    protected _onComplete() {
        this.dispatch("complete")
    }

    protected buildCommonTaskResult(task: CommonTask): TaskResult {
        return {
            success: true,
            id: task.id,
            name: task.name,
            extra: task.extra
        }
    }

    protected buildTaskSuccessResult(task: CommonTask, result: any): TaskResult {
        const r = this.buildCommonTaskResult(task);
        r.result = result;
        return r;
    }

    protected buildTaskErrorResult(task: CommonTask, error: any): TaskResult {
        const r = this.buildCommonTaskResult(task);
        r.error = error;
        return r;
    }
}

