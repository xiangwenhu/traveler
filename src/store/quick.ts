import store from "./index";

export function getMapFitZoom() {
    return store.state["map"].fitZoom;
}