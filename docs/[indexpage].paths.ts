import { getNavData } from "./.vitepress/plugins/vitepress-easy-theme/lib/nav"

export default {
  paths() {
    const nav = getNavData({ enableDirActiveMatch: true })
    const res = nav.map(item=> ({params: {indexpage: `${item.link.slice(1)}index`}}))
    // console.log(res)
    return res
  }
}