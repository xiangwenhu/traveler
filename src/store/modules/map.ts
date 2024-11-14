import { ActionContext } from "vuex";

export enum EnumColorRegionLevel {
    Province = 1,
    City = 2,
}

export interface MapSettingState {
    colorRegionLevel: EnumColorRegionLevel;
    chinaOnly: boolean
}
const state = (): MapSettingState => ({
    colorRegionLevel: EnumColorRegionLevel.City, // 登录token
    chinaOnly: false,
});

// getters
const getters = {
    colorRegionLevel(state: MapSettingState) {
        return state.colorRegionLevel;
    },
    value(state: MapSettingState){
        return {
            ...state
        }
    }
};

// mutations
const mutations = {
    setColorRegionLevel(state: MapSettingState, val: EnumColorRegionLevel) {
        state.colorRegionLevel = val;
    },
    setChinaOnly(state: MapSettingState, val: boolean){
        state.chinaOnly = val
    },
    setValue(state: MapSettingState, val: MapSettingState){
        for(let key in val){
            // @ts-ignore
            state[key] = val[key]
        }
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
