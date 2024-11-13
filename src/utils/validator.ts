const REG_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const validatorEmail = (rule: any, value: any, callback: any) => {
    if (!rule.required && (value == "" || value == undefined )) {
        return callback();;
    }

    if (REG_EMAIL.test(value)) {
        return callback();
    }
    callback(new Error("请输入有效的邮箱地址"));
};
