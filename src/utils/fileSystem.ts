import { get, set } from "idb-keyval";


export interface HandleInfo {
    handle: FileSystemDirectoryHandle;
    addTime: number;
}

export async function ensureDirHandle(key: string, checkCache: boolean = true) {
    try {

        if (checkCache) {
            const handleInfo = await get<HandleInfo>(key);
            if (handleInfo) {
                return handleInfo.handle;
            }
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


export async function verifyPermission(handle: FileSystemFileHandle | FileSystemDirectoryHandle, withWrite: boolean = true) {
    const opts: FileSystemHandlePermissionDescriptor = {};
    if (withWrite) {
        opts.mode = "readwrite";
    }

    // Check if we already have permission, if so, return true.
    if ((await handle.queryPermission(opts)) === "granted") {
        return true;
    }

    // Request permission to the file, if the user grants permission, return true.
    if ((await handle.requestPermission(opts)) === "granted") {
        return true;
    }

    // The user did not grant permission, return false.
    return false;
}