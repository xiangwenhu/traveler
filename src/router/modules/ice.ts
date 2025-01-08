import type { Route } from "../index.type";
import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";


const route: Route[] = [
    {
        path: "/ice",
        component: Layout,
        redirect: "/ice/project/list",
        meta: { title: "ICE", icon: "Ship" },
        alwayShow: true,
        hideMenu: true,
        children: [
            {
                path: "project/list",
                component: createNameComponent(
                    () => import("@/views/main/ice/projectList/index.vue")
                ),
                meta: {
                    title: "项目列表",
                    cache: false,
                },
            },
            {
                path: "project/:travelId",
                component: createNameComponent(
                    () => import("@/views/main/ice/travelProjectDetail/index.vue")
                ),
                meta: {
                    title: "项目详情",
                    cache: false,
                },
            }
        ],
    },
];

export default route;
