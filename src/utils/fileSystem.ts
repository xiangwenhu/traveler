import { get, set } from "idb-keyval";


export interface HandleInfo {
    handle: FileSystemDirectoryHandle;
    addTime: number;
}

export async function ensureDirHandle(key: string) {
    try {
        const handleInfo = await get<HandleInfo>(key);
        if (handleInfo) {
            return handleInfo.handle;
        }
        const dirHandle = await window.showDirectoryPicker({
            mode: "readwrite",
        });
        await set(key, {
            addTime: Date.now(),
            handle: dirHandle,
        });

        return dirHandle;
    } catch (err) {
        return undefined;
    }
}