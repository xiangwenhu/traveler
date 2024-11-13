import type { Route } from "../index.type";
import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
import { EnumRole } from "@/types/permission";
const route: Route[] = [
    {
        path: "/systemManage",
        component: Layout,
        redirect: "/systemManage/userManage",
        meta: { title: "系统管理", icon: "Setting" },
        alwayShow: true,
        children: [
            {
                path: "userManage",
                component: createNameComponent(
                    () => import("@/views/main/systemManage/users/index.vue")
                ),
                meta: {
                    title: "用户管理",
                },
            },

            // {
            //     path: "warningEmail",
            //     component: createNameComponent(
            //         () => import("@/views/main/systemManage/email/index.vue")
            //     ),
            //     meta: { title: "报警邮箱" },
            // },
        ],
    },
];

export default route;
