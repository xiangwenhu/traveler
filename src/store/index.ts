import { createStore, createLogger } from 'vuex'
import Persistent from './plugins/persistent'
import {userState} from "@/store/modules/user";
import {keepAliveState} from "@/store/modules/keepAlive";
import {appState} from "@/store/modules/app";
import { MapSettingState } from './modules/map';
const debug = import.meta.env.MODE !== 'production'
const files= import.meta.glob('./modules/*.ts', { eager: true })

export interface RootState {
  user: userState,
  keepAlive: keepAliveState,
  app: appState,
  map: MapSettingState
}

let modules: any = {}
Object.keys(files).forEach((c: string) => {
  const module = files[c].default
  const moduleName: string = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
  modules[moduleName] = module
})

// 这是一个vuex本地存储插件，默认把vuex所有数据都做存储了
// local代表存储在localStorage里面，进行永久存储
// session代表存储在sessionStorage里面，进行临时存储
// 都接收Modules的文件名数组，如：['app', 'keepAlive', 'user']
// 用户相关的数据建议直接存储在local里面，session里面会导致打开新窗口时获取不到token值，因为session只针对当前会话
const persistent = Persistent({ key: '_traveler_vuex__', modules, modulesKeys: {
  local: ["app", "user"],
  session: []
} })

export default createStore<RootState>({
  modules: {
    ...modules
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistent] : [persistent]
})
