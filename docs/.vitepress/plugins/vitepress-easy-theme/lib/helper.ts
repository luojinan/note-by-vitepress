import { normalize } from 'path'
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

/**
 * 获取dirOrFileFullName中第一个/docs/后的所有内容
 * 
 * 如:
 * /a-root/docs/test 则 获取到 /test
 * /a-root-docs/docs/test 则 获取到 /test
 * /a-root-docs/docs/docs/test 则 获取到 /docs/test
 * 
 * @param   {string}  dirOrFileFullName  文件或者目录名
 * @return  {string}                     返回/docs/后的路径，以/开头
 */
export function getDocsDirNameAfterStr(dirOrFileFullName: string) {
  // 1. 规范化路径（处理不同操作系统的路径分隔符）
  const normalizedPath = normalize(dirOrFileFullName).replace(/\\/g, '/');
  
  // 2. 查找/docs/的位置
  const docsIndex = normalizedPath.indexOf('/docs/');
  if (docsIndex === -1) {
    return '/';
  }
  
  // 3. 提取/docs/之后的部分（包含开头的/）
  return normalizedPath.substring(docsIndex + 5);  // 5 是 '/docs/'的长度
}