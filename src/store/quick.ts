import store from "./index";

export function getMapFitZoom() {
    return store.state["map"].fitZoom;
}

export function isReadOnlyUser() {
    return !(store.state["user"]?.info?.readonly === false);
}