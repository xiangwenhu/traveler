import type { Route } from "../index.type";
import Layout from "@/layout/mobile.vue";
import { createNameComponent } from "../createNode";


const route: Route[] = [
    {
        path: "/mobile",
        component: Layout,
        redirect: "/mobile/index",
        meta: { title: "移动端", icon: "Phone" },
        alwayShow: true,
        children: [
            {
                path: "index",
                component: createNameComponent(
                    () => import("@/views/main/mobile/index.vue")
                ),
                meta: {
                    title: "旅行记录",
                },
            }
        ],
    },
];

export default route;
