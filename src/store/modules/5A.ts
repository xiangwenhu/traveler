import { AAAAAItem } from "@/types/service";


export interface AAAAAState {
    items: AAAAAItem[] ;
}
const state = (): AAAAAState => ({
    items: [], // 登录token
});

// getters
const getters = {
    items(state: AAAAAState) {
        return state.items;
    },
    value(state: AAAAAState){
        return {
            ...state
        }
    }
};

// mutations
const mutations = {
    setItems(state: AAAAAState, val: AAAAAItem[]) {
        state.items = val;
    }
};

// actions
const actions = {

};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
};
