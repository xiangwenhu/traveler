
/** 设置和拉取tab数据的主方法 */
const tabsHook = {
  setItem: function(arr: object[]) {
    localStorage.setItem('_traveler_tabs__', JSON.stringify(arr))
  },
  getItem: function() {
    return JSON.parse(localStorage.getItem('_traveler_tabs__') || '[]')
  }
}
export default tabsHook
