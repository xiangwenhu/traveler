import { ActionContext } from "vuex";

export enum EnumColorRegionLevel {
    Province = 1,
    City = 2,
}

export interface MapSettingState {
    colorRegionLevel: EnumColorRegionLevel;
}
const state = (): MapSettingState => ({
    colorRegionLevel: EnumColorRegionLevel.City, // 登录token
});

// getters
const getters = {
    colorRegionLevel(state: MapSettingState) {
        return state.colorRegionLevel;
    }
};

// mutations
const mutations = {
    setColorRegionLevel(state: MapSettingState, val: EnumColorRegionLevel) {
        state.colorRegionLevel = val;
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
