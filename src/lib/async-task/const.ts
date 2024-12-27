import { ManagerOptions } from "./types";

export const noop = () => { };

export const DEFAULT_OPTIONS: ManagerOptions = {
    enableDisturb: false,
    maxConcurrent: 5,
    cancelOnTaskError: false,
    cancelWaitUntilAllTaskCompleted: false,
}
