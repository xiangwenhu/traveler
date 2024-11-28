/**
 * 前端路由管理
 **/

/** 路由类型 */
import type { Route } from "../index.type";

/** 引入需要权限的Modules */
import Dashboard from "../modules/dashboard";
import Manage from "../modules/manage";
import Travel from "../modules/travel";
import Mobile from "../modules/mobile"

/** 登录后需要动态加入的本地路由 */
const FrontRoutes: Route[] = [
    ...Dashboard,
];

const permissionRoutes = [...Manage, ...Travel, ...Mobile];

export default function getRoutes() {
    return FrontRoutes.concat(permissionRoutes);
}
