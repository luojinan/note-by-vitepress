// https://github.com/QC2168/vite-plugin-vitepress-auto-sidebar/blob/main/src/index.ts
import { join } from 'path'
import { readdirSync, statSync } from 'fs'
import { SideBarItem, SidebarGenerateConfig } from './types'
import { docsPath, getDocsDirNameAfterStr, isMarkdownFile } from './helper'
import { fileURLToPath } from 'url'
export function getSidebarData(sidebarGenerateConfig: SidebarGenerateConfig = {}) {
  const {
    dirName = 'articles',
    ignoreFileName = 'index.md',
    ignoreDirNames = ['demo', 'asserts'],
  } = sidebarGenerateConfig
  // 获取目录的绝对路径
  const dirFullPath = fileURLToPath(new URL(`./${dirName}`,docsPath))
  // const dirFullPath = resolve(__dirname, `../${dirName}`)
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const obj = {}
  allDirAndFileNameArr.map(dirName => {
    let subDirFullName = join(dirFullPath, dirName)
    const property = getDocsDirNameAfterStr(subDirFullName).replace(/\\/g, '/') + '/'
    const arr = getSideBarItemTreeData(subDirFullName, 1, 2, ignoreFileName, ignoreDirNames)
    obj[property] = arr
  })
  // console.log('sidebarData')
  // console.log(obj)
  return obj
}

function getSideBarItemTreeData(
  dirFullPath: string,
  level: number,
  maxLevel: number,
  ignoreFileName: string,
  ignoreDirNames: string[]
): SideBarItem[] {
  // 获取所有文件名和目录名
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const result: SideBarItem[] = []
  allDirAndFileNameArr.map((fileOrDirName: string, idx: number) => {
    const fileOrDirFullPath = join(dirFullPath, fileOrDirName)
    const stats = statSync(fileOrDirFullPath)
    if (stats.isDirectory()) {
      if (!ignoreDirNames.includes(fileOrDirName)) {
        const text = fileOrDirName.match(/^[0-9]{2}-.+/) ? fileOrDirName.substring(3) : fileOrDirName
        // 当前为文件夹
        const dirData: SideBarItem = {
          text,
          collapsed: true,
        }
        if (level !== maxLevel) {
          dirData.items = getSideBarItemTreeData(fileOrDirFullPath, level + 1, maxLevel, ignoreFileName, ignoreDirNames)
        }
        if (dirData.items) {
          dirData.collapsible = true
        }
        result.push(dirData)
      }
    } else if (isMarkdownFile(fileOrDirName) && ignoreFileName !== fileOrDirName) {
      // console.log(fileOrDirName)
      // 当前为文件
      const matchResult = fileOrDirName.match(/(.+)\.md/)
      let text = matchResult ? matchResult[1] : fileOrDirName
      text = text.match(/^[0-9]{2}-.+/) ? text.substring(3) : text
      // console.log(text)
      const fileData: SideBarItem = {
        text,
        link: getDocsDirNameAfterStr(fileOrDirFullPath).replace('.md', '').replace(/\\/g, '/'),
      }
      result.push(fileData)
    }
  })
  return result
}
