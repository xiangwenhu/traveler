// https://github.com/sindresorhus/p-is-promise
export const isObject = (value: any) => value !== null &&
    (typeof value === 'object' || typeof value === 'function');

export const isFunction = (value: any) => {
    return typeof value === 'function'
}

export function isPromise(value: any) {
    return value instanceof Promise ||
        (
            isObject(value) &&
            typeof value.then === 'function' &&
            typeof value.catch === 'function'
        );
}

export function firstToUpper(str: string){
    if(typeof str !== 'string' || str.length === 0){
        return ""
    }
    return str[0].toUpperCase() + str.substring(1)
}