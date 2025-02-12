import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '',
    component: Layout,
    redirect: '/dashboard/map',
    meta: { title: '数据地图', icon: "MapLocation" },
    children: [
      {
        path: '/dashboard/map',
        component: createNameComponent(() => import('@/views/main/dashboard/map/index.vue')),
        meta: { title: '数据地图', hideClose: true, icon: "MapLocation", cache: false }
      }, 
      {
        path: '/dashboard/echarts',
        component: createNameComponent(() => import('@/views/main/dashboard/echarts/index.vue')),
        meta: { title: 'echarts地图', hideClose: false, icon: "MapLocation", cache: false }
      },
      {
        path: '/dashboard/5a',
        component: createNameComponent(() => import('@/views/main/dashboard/5a/index.vue')),
        meta: { title: '5A景区', hideClose: false, icon: "MapLocation", cache: false }
      },
      {
        path: '/dashboard/school',
        component: createNameComponent(() => import('@/views/main/dashboard/school/index.vue')),
        meta: { title: '高校', hideClose: false, icon: "MapLocation", cache: false }
      },
      {
        path: '/dashboard/3D',
        component: createNameComponent(() => import('@/views/main/dashboard/3D/index.vue')),
        meta: { title: '3D', hideClose: false, icon: "MapLocation", cache: false }
      },
      {
        path: '/dashboard/report',
        component: createNameComponent(() => import('@/views/main/dashboard/report/index.vue')),
        meta: { title: '报表', hideClose: false, icon: "TrendCharts", cache: false }
      }
    ]
  }
]

export default route