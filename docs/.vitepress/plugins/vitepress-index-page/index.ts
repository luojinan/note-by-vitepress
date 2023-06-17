import glob from 'fast-glob'

const generrateIndexPage = (id)=>{
  const [,title] = id.match(/articles\/(.*?)\/index.md/)
  
  const files = glob.sync([`${id.match(/(.*?)\/index.md/)[1]}/**/*.md`])
  const list = files.reduce((res,next)=>{
    const [,pagePath] = next.match(/articles\/(.*?).md/) || []
    const [,dir, md] = pagePath.split('/')

    if(dir==='index') return res
    const index = res.findIndex(item=>item.title === dir)
    if(index>-1) {
      res[index].childs.push({title: md})
    }else{
      res.push({title: dir, childs:[{title: md}]})
    }
    return res
  },[])
  const test = JSON.stringify(list)
  return `
<script setup>
import IndexPage from '/Users/luojinan/Desktop/code/vitepress/docs/.vitepress/plugins/vitepress-index-page/IndexPage.vue'
const list = ${test}
</script>

# ${title.substring(3)}
<IndexPage :list="list" />
`
}

export function VitepressIndexPage() {
  return {
    name: 'vitepress-index-page',
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