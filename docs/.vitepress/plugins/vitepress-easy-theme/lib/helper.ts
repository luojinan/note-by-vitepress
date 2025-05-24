import { sep } from 'path'
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';
/**
 * 判断是否为markdown文件
 * @param   {string}  fileName  文件名
 * @return  {[boolean]}         有返回值则表示是markdown文件,否则不是
 */
export function isMarkdownFile(fileName: string) {
  return fileName.match(/.+\.md$/)
}

export const docsPath = pathToFileURL(`${cwd()}/docs/`).href;

// 获取docs目录的完整名称(从根目录一直到docs目录)
// const docsDirFullPath = join(__dirname, '../')
// 获取docs目录的完整长度
const docsDirFullPathLen = docsPath.length - 8

/**
 * 获取dirOrFileFullName中第一个/docs/后的所有内容
 *
 * 如:
 * /a-root/docs/test 则 获取到 /test
 * /a-root-docs/docs/test 则 获取到 /test
 * /a-root-docs/docs/docs/test 则 获取到 /docs/test
 *
 * @param   {string}  dirOrFileFullName  文件或者目录名
 * @return  {[type]}                     [return description]
 */
export function getDocsDirNameAfterStr(dirOrFileFullName: string) {
  // 使用docsDirFullPathLen采用字符串截取的方式，避免多层目录都叫docs的问题
  return `${sep}${dirOrFileFullName.substring(docsDirFullPathLen)}`
}