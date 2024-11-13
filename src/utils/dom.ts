function getType(type: string) {
    return `$$__${type}__$$`;
}

export function fireEvent(type: string, data?: any) {
    const event = new CustomEvent(getType(type), {
        detail: data,
    });

    window.dispatchEvent(event);
}

export function addEvent(type: string, listener: (data: any) => void) {
    const innerListener = function (ev: CustomEvent) {
        const data = ev.detail;
        listener.call(null, data);
    };

    window.addEventListener(getType(type), innerListener as any);

    return () =>
        window.removeEventListener(getType(type), innerListener as any);
}
