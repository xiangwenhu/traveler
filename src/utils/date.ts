import * as fns from 'date-fns';

export function formatDate(val: number | string | Date, format = "yyyy-MM-dd HH:mm:ss"){
    const d = new Date(val);
    return fns.format(d, format)
}