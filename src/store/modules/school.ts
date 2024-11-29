import { SchoolItem } from "@/types/service";


export interface SchoolState {
    items: SchoolItem[] ;
}
const state = (): SchoolState => ({
    items: [], // 登录token
});

// getters
const getters = {
    items(state: SchoolState) {
        return state.items;
    },
    value(state: SchoolState){
        return {
            ...state
        }
    }
};

// mutations
const mutations = {
    setItems(state: SchoolState, val: SchoolItem[]) {
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
