import { isMobile } from "./utils";

export default function init() {
    const isMob = isMobile();
    if (isMob) {
        document.documentElement.classList.add("mobile")
    }
}