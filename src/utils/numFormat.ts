
// 数据加逗号,如2000,123,235
export function insertComma(num: any) {
    return Number(num).toLocaleString();
}

// 针对万、亿、兆数据转换
export function changeNumToUnit(num: string) {
    
    const len = num.length;
    let amount = "";
    let unit = "兆";
    if (num && num.length > 0) {
        if (len > 4 && len < 9) {
            amount = num.slice(0, -4);
            unit = "万";
        } else if (len >= 9 && len < 13) {
            amount = num.slice(0, -8);
            unit = "亿";
        } else if (len >= 13){
            amount = num.slice(0, -12);
            unit = "兆";
        }
    }
    
    return {amount, unit};
}