import glob from 'fast-glob'
import { getRandomEmoji } from './emoji'

const generrateIndexPage = (id)=>{
  const [,title] = id.match(/articles\/(.*?)\/index.md/)

  const files = glob.sync([`${id.match(/(.*?)\/index.md/)[1]}/**/*.md`])
  const list = files.reduce((res,next)=>{
    const [,pagePath] = next.match(/articles\/(.*?).md/) || []
    const [,dir, md] = pagePath.split('/')

    if(dir==='index') return res
    const index = res.findIndex(item=>item.title === dir)
    const emoji = getRandomEmoji()
    const childItem = {
      title: md,
      path: `articles/${title}/${dir}/${md}`,
      emoji,
    }
    if(index>-1) {
      res[index].childs.push(childItem)
    }else{
      res.push({title: dir, childs:[childItem]})
    }
    return res
  },[])
  const test = JSON.stringify(list)
  const IndexPageCompPath = new URL('./IndexPage.vue', import.meta.url).pathname
  return `
<script setup>
import IndexPage from '${IndexPageCompPath}'
const list = ${test}
</script>

# ${title.substring(3)}
<IndexPage :list="list" />
`
}

export function VitepressIndexPage() {
  return {
    name: 'vitepress-index-page',
    // 👇 nav link 虚拟文件
    resolveId(id) {
      if (/articles\/(.*?)index\.md/.test(id)) {
        const { pathname } = new URL(`../../..${id}`, import.meta.url)
        return decodeURI(pathname)
      }
    },
    load(id) {
      if (/articles\/(.*?)index\.md/.test(id)) {
        return ''
      }
    },
    // 👇 nav indexPage 内容
    transform(src, id) {
      if (/articles\/(.*?)index\.md/.test(id)) {
        // console.log(id,src)
        return {
          code: generrateIndexPage(id),
          map: null, // provide source map if available
        }
      }
    },
    enforce: 'pre'
}
}