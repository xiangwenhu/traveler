export function isIndexedBDSupported() {
    try {
        return 'indexedDB' in window &&
            window.indexedDB !== undefined;
    } catch (e) {
        return false;
    }
}

export function isFileSystemApiSupported() {
    return typeof window.showDirectoryPicker === 'function';
}