import { loginApi, getInfoApi, loginOutApi } from "@/api/user";
import { ActionContext } from "vuex";

export interface userState {
    token: string;
    info: {
        isAdmin: boolean,
        readonly: boolean,
        account: string;
        name: string;
    };
}
const state = (): userState => ({
    token: "", // 登录token
    info: {} as any, // 用户信息
});

// getters
const getters = {
    token(state: userState) {
        return state.token;
    },
    info(state: userState){
        return state.info
    }
};

// mutations
const mutations = {
    tokenChange(state: userState, token: string) {
        state.token = token;
    },
    infoChange(state: userState, info: object) {
        state.info = info;
    },
};

// actions
const actions = {
    // login by login.vue
    login(
        { commit, dispatch }: ActionContext<userState, userState>,
        params: any
    ) {
        return new Promise((resolve, reject) => {
            loginApi(params)
                .then((res) => {
                    commit("tokenChange", res.data.token);
                    commit("infoChange", res.data);
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    // login out the system after user click the loginOut button
    loginOut({ commit }: ActionContext<userState, userState>) {
        // loginOutApi()
        //     .then((res) => {})
        //     .catch((error) => {})
        //     .finally(() => {
        localStorage.removeItem("_traveler_tabs__");
        localStorage.removeItem("_traveler_vuex__");
        sessionStorage.removeItem("_traveler_vuex__");
        location.reload();
        // });
    },
};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
};
