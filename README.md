## 摘要
人生就是一场大的旅行，记录人生，记录旅行。


## 特色



## 功能
- 地图和报表
  - 数据地图
  - echarts地图
  - 5A景区
  - 高校
  - 报表
- 数据管理
  - 用户管理
  - 标签管理
  - 5A管理
  - 高校管理
- 旅行
  - 旅行记录
  - 旅行计划





## TODO::
- [x] 只显示中国区域 （原理：mask)，参考 https://lbs.amap.com/demo/javascript-api-v2/example/3d/mask
- [x] 比例尺(ok)，方向展示 
- [x] 测距工具等 (2024-12-18)
- [x] 根据过滤旅行，比如某省，  调整地图范围
- [x] 菜单改造 （2024-12-31） 类似微信
- [ ] 云剪辑
  - [x] 接入阿里云剪辑 (2025-01-07)
  - [x] 剪辑项目 关联 旅行  (2025-01-08)
  - [x] 剪辑项目 资源导入 支持本地资源直接导入旅行项目   (2025-01-09)
  - [x] 改进检查资源导入完毕的检测，目前是等待固定时间，改进为通过 媒体ID查询状态 (2025-01-14)
  - [ ] 文件名显示改进
- [x] 资源同步到本地(单次旅行) (2024-12-27)
- [ ] 删除旅行的时候，删除关联的OSS资源
- [ ] 资源同步到本地（全部）
- [ ] 域名
- [ ] https证书
- [ ] 旅行计划地图，播放，提醒？
- [ ] 报表生成截图
- [ ] 3D地图

## bug 修复历史
- [x] 封面uuid路径，不然重名导致封面重复。 (2025-01-27)





## 其他资源
1. [adcode与省市行政区对照表](https://a.amap.com/lbs/static/file/AMap_adcode_citycode.xlsx.zip) 来源 https://lbs.amap.com/api/javascript-api-v2/documentation#districtlayer
2. [中国行政区 geoJSON 数据](https://datav.aliyun.com/portal/school/atlas/area_selector)