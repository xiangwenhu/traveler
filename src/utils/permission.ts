import store from "@/store";
import { EnumRole } from "@/types/permission";

const internal_operator = "internal_operator";
export function isInternalOperator() {
    const userInfo = store.getters["user/info"] || {};
    return userInfo.identity === internal_operator;
}

export function getCurrentUserRole() {
    const userInfo = store.getters["user/info"] || {};
    return userInfo.identity as EnumRole;
}

export function hasPermission(roles: EnumRole[] | EnumRole | undefined) {
    if (!roles) return true;
    const userRole = getCurrentUserRole();
    if (!userRole) return false;

    const rs = Array.isArray(roles) ? roles : [roles];
    return (rs || []).indexOf(userRole) >= 0;
}
