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
                path: "list",
                component: createNameComponent(
                    () => import("@/views/main/travel/travels/index.vue")
                ),
                meta: {
                    title: "旅行记录",
                },
            },
            {
                path: "plan",
                component: createNameComponent(
                    () => import("@/views/main/travel/plans/index.vue")
                ),
                meta: {
                    title: "旅行计划",
                },
            },
            {
                path: "detail/:id",
                component: createNameComponent(
                    () => import("@/views/main/travel/detail/index.vue")
                ),
                meta: { title: "旅行详情" },
                alwayShow: false,
                hideMenu: true,
            },

        ],
    },
];

export default route;
