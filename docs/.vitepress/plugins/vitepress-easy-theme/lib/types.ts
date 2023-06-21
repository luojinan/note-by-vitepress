export interface SidebarGenerateConfig {
  dirName?: string // 需要遍历的目录. 默认:articles
  ignoreFileName?: string // 忽略的文件名. 默认: index.md
  ignoreDirNames?: string[] // 忽略的文件夹名称. 默认: ['demo','asserts']
}
export interface SideBarItem {
  text: string
  collapsible?: boolean
  collapsed?: boolean
  items?: SideBarItem[]
  link?: string
}
export interface NavGenerateConfig {
  enableDirActiveMatch: boolean // 是否启用路由匹配显示激活状态. 默认:false
  dirName?: string // 需要遍历的目录. 默认:articles
  maxLevel?: number // 最大遍历层级. 默认:1
}