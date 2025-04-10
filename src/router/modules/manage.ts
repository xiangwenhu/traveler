import type { Route } from "../index.type";
import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
const route: Route[] = [
    {
        path: "/manage",
        component: Layout,
        redirect: "/manage/userManage",
        meta: { title: "资源管理", icon: "Memo" },
        alwayShow: true,
        children: [
            {
                path: "tag",
                component: createNameComponent(
                    () => import("@/views/main/manage/tags/index.vue")
                ),
                meta: {
                    title: "标签管理",
                    cache: false,
                },

            },
            {
                path: "5a",
                component: createNameComponent(
                    () => import("@/views/main/manage/5A/index.vue")
                ),
                meta: {
                    title: "5A管理",
                    cache: false,
                },

            },
            {
                path: "school",
                component: createNameComponent(
                    () => import("@/views/main/manage/school/index.vue")
                ),
                meta: {
                    title: "高校管理",
                    cache: false,
                },

            }

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
