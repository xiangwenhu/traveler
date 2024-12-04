import { number } from "echarts";
import { ActionContext } from "vuex";

export enum EnumColorRegionLevel {
    Province = 1,
    City = 2,
}

export interface MapSettingState {
    colorRegionLevel: EnumColorRegionLevel;
    chinaOnly: boolean;
    fitZoom: number;
}
const state = (): MapSettingState => ({
    colorRegionLevel: EnumColorRegionLevel.City, // 登录token
    chinaOnly: false,
    fitZoom: 5,
});

// getters
const getters = {
    colorRegionLevel(state: MapSettingState) {
        return state.colorRegionLevel;
    },
    value(state: MapSettingState) {
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
    setChinaOnly(state: MapSettingState, val: boolean) {
        state.chinaOnly = val
    },
    setValue(state: MapSettingState, val: MapSettingState) {
        for (let key in val) {
            // @ts-ignore
            state[key] = val[key]
        }
    },
    setFitZoom(state: MapSettingState, val: number) {
        state.fitZoom = val;
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
