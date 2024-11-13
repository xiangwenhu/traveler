import request from "@/utils/system/request";

/** 登录api */
export function loginApi(params: {
    account: string;
    password: string;
}) {
   
    const data = {
      account: params.account,
      password: params.password
    }
    return request({
        url: "user/login",
        method: "post",
        data: data
    });
}

/** 退出登录Api */
export function loginOutApi() {
    return request({
        url: "/user/out",
        method: "post",
        baseURL: "/mock",
    });
}

/** 获取用户信息Api */
export function passwordChange(data: object) {
    return request({
        url: "/user/passwordChange",
        method: "post",

        data,
    });
}

/** 获取登录后需要展示的菜单 */
export function getMenuApi() {
    return request({
        url: "/menu/list",
        method: "post",
        baseURL: "/mock",
    });
}
