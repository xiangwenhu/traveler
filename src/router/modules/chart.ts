import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/echarts',
    component: Layout,
    redirect: '/echarts/dragable',
    meta: { title: 'message.menu.echarts.name' },
    children: [
      {
        path: 'bar',
        component: createNameComponent(() => import('@/views/main/echarts/bar.vue')),
        meta: { title: 'message.menu.echarts.bar' , cache: false },
      
      },
      {
        path: 'line',
        component: createNameComponent(() => import('@/views/main/echarts/line.vue')),
        meta: { title: 'message.menu.echarts.line' , cache: false }
      },
      {
        path: 'pie',
        component: createNameComponent(() => import('@/views/main/echarts/pie.vue')),
        meta: { title: 'message.menu.echarts.pie' , cache: false }
      },
      {
        path: 'radar',
        component: createNameComponent(() => import('@/views/main/echarts/radar.vue')),
        meta: { title: 'message.menu.echarts.radar' , cache: false }
      },
      {
        path: 'map',
        component: createNameComponent(() => import('@/views/main/echarts/map.vue')),
        meta: { title: 'message.menu.echarts.map' , cache: false }
      },
    ]
  }
]

export default route