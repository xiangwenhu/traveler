import type { Route } from "../index.type";
import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
const route: Route[] = [
    {
        path: "/systemManage",
        component: Layout,
        meta: { title: "系统管理", icon: "Setting" },
        alwayShow: true,
        children: [
            {
                path: "logout",
                component: createNameComponent(
                    () => import("@/views/system/logOut.vue")
                ),
                meta: { title: "登出" },
            },
            {
                path: "userInformation",
                component: createNameComponent(
                    () => import("@/views/main/manage/users/UserDetail.vue")
                ),
                meta: {
                    title: "用户信息",
                    cache: false,
                },
            },
            {
                path: "userManage",
                component: createNameComponent(
                    () => import("@/views/main/manage/users/index.vue")
                ),
                meta: {
                    title: "用户管理",
                    cache: false,
                },
            },
        ],
    }

];

export default route;
