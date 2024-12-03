export function isSmallSizeDevice() {
    const width =  Math.max(document.documentElement.offsetWidth, window.innerWidth);
    return width <= 600;
}

const CONFIG = {
  mobile: {
    "label-position": "top",
  },
  pc: {
    "label-position": "left",
  },
};

export function getFormSettings() {
  const isMobile = isSmallSizeDevice();
  return isMobile ? CONFIG.mobile : CONFIG.pc;
}