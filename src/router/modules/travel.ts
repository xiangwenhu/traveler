import type { Route } from "../index.type";
import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";


const route: Route[] = [
    {
        path: "/travel",
        component: Layout,
        redirect: "/travel/travels",
        meta: { title: "旅行管理", icon: "Ship" },
        alwayShow: true,
        children: [
            {
                path: "userManage",
                component: createNameComponent(
                    () => import("@/views/main/travel/travels/index.vue")
                ),
                meta: {
                    title: "旅行记录",
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
