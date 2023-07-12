import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import { DefaultTheme } from 'vitepress'
import { docsPath, getDocsDirNameAfterStr, isMarkdownFile } from './helper'
import { NavGenerateConfig } from './types'

/**
 * 获取顶部导航数据
 *
 * @param   {string}     dirFullPath  当前需要遍历的目录绝对路径
 * @param   {number}     level        当前层级
 * @param   {number[]}   maxLevel     允许遍历的最大层级
 * @param   {boolean}    enableActiveMatch 是否启用路由匹配显示激活状态
 *
 * @return  {NavItem[]}               导航数据数组
 */
function getNavDataArr(
  dirFullPath: string,
  level: number,
  maxLevel: number,
  enableActiveMatch: boolean
): DefaultTheme.NavItem[] {
  // 获取所有文件名和目录名
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const result: DefaultTheme.NavItem[] = []
  allDirAndFileNameArr.map((fileOrDirName: string) => {
    const fileOrDirFullPath = join(dirFullPath, fileOrDirName)
    const stats = statSync(fileOrDirFullPath)
    const link = getDocsDirNameAfterStr(fileOrDirFullPath).replace('.md', '').replace(/\\/g, '/')
    // console.log(fileOrDirFullPath)
    // console.log(link)
    const text = fileOrDirName.match(/^[0-9]{2}-.+/) ? fileOrDirName.substring(3) : fileOrDirName
    if (stats.isDirectory()) {
      // 当前为文件夹
      const dirData: DefaultTheme.NavItem = {
        text,
        link: `${link}/`,
      }
      if (level !== maxLevel) {
        // @ts-ignore
        dirData.items = getNavDataArr(fileOrDirFullPath, level + 1, maxLevel, enableActiveMatch)
      }
      if (enableActiveMatch) {
        dirData.activeMatch = link + '/'
      }
      result.push(dirData)
    } else if (isMarkdownFile(fileOrDirName)) {
      // 当前为文件
      const fileData: DefaultTheme.NavItem = {
        text,
        link: link,
      }
      if (enableActiveMatch) {
        fileData.activeMatch = link + '/'
      }
      result.push(fileData)
    }
  })
  return result
}

export function getNavData(navGenerateConfig: NavGenerateConfig) {
  const { enableDirActiveMatch, dirName = 'articles', maxLevel = 1 } = navGenerateConfig
  // new URL()
  // console.log(import.meta.url, docsPath)
  // console.log('1111', new URL(`./docs/${dirName}`,docsPath).pathname)
  const dirFullPath =  new URL(`./${dirName}`,docsPath).pathname
  console.log('dirFullPath',dirFullPath)
  const result = getNavDataArr(dirFullPath, 1, maxLevel, enableDirActiveMatch)
  // console.log('navData')
  // console.log(result)
  return result
}
