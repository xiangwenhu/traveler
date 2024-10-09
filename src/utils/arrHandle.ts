// 过滤对象中的空数据
export function filterObjEmptyVal(obj: any) {
    for (const i in obj) {
        if (obj[i] === "" || obj[i] === null || obj[i] === "null") {
            delete obj[i];
        }
    }
    return obj;
}

/**
 * 删除空的数据，不破坏原数据，主要用于数据提交或者搜索
 * @param obj
 * @returns
 */
export function copyUnEmptyProperty<T= Record<string, any>>(obj: T = {} as any):T {
    // 非普通对象
    if (obj == null || typeof obj !== "object") {
        return {} as T
    }

    const result: Record<string, any> = Object.create(null);
    // 不读原型上的属性
    const keys = Object.keys(obj);
    let key, val, isString;
    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        // @ts-ignore
        val = obj[key];
        isString = typeof val === "string";
        if (val == null || (isString && val.trim() == "")) {
            continue;
        }
        result[key] = isString ? val.trim() : val;
    }
    return result as T;
}


export function deleteEmptyArr(obj: Record<string, any> = {},
    fun: (arr: any[]) => boolean = (arr: any[]) => arr.length == 0 || arr.some(v => v == undefined)
) {
    // 非普通对象
    if (obj == null || typeof obj !== "object") {
        return {};
    }
    const result: Record<string, any> = Object.create(null);
    // 不读原型上的属性
    const keys = Object.keys(obj);
    let key, val, isArray;
    for (let i = 0; i < keys.length; i++) {
        key = keys[i];
        val = obj[key];
        isArray = Array.isArray(val);
        if (isArray) {
            const isInValid = fun(val);
            if (isInValid) {
                continue;
            }
            result[key] = val;
        } else {
            result[key] = val;
        }
    }
    return result;
}

export function getKeyByValue(obj: any, value: string | number) {
    return Object.keys(obj).find((key) => obj[key] === value);
}

/** 根据配置ID字段获取名字name */
export const getNameById = (data: { id: number | string; name: string }[], targetId: number) => {
    const res = data.find((v) => v.id === targetId);
    return res?.name
};

/** 根据配置name字段获取ID */
export const getIdByName = (data: { id: number | string; name: string }[], name: number | string) => {
    const res = data.find((v) => v.name === name);
    return res?.id
};