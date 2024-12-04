## issue

> 目前响应式API应该没有管setData，一个响应的变量被更改并更新到界面上之后，再去做一些事情要怎么实现呢
> 比如setData界面更新之后 querySelector 计算高度进行锚点
>
> 目前响应式API应该没有管setData，一个响应的变量被更改并更新到界面上之后，再去做一些事情要怎么实现呢
>
> 从 v1.0.0-beta.4 开始，标记为 `flush: 'post'` 的观察器会在页面渲染后执行。这可以覆盖 setData 回调的用例。

```js
defineComponent({
  setup() {
    const show = ref(false)
   watch(show, () => {
     // 会在 show 变更触发的重渲染之后执行
     // ...
   }, { flush: 'post' })
   // ...
 }
})
```

在web开发中，setup需要模版里用的变量，其他不return都是内部变量/函数

而在小程序中，setup里同样return模版里用的变量，但是其他变量可能

1. 内部变量/函数
2. 小程序页面生命周期（web的生命周期onMonth()

   ```js
   // setup script
   onMounted(async () => {
     const res = await getApi()
     basinfo.value = res
   })
   ```

3. 与微信原生交互的函数定义，不需要放到setup return里

- `onLoad` -> `setup`
- `onShow` -> `onShow`
- `onReady` -> `onReady`
- `onHide` -> `onHide`
- `onUnload` -> `onUnload`
- `onRouteDone` -> `onRouteDone`

- `onPullDownRefresh` -> `onPullDownRefresh`
- `onReachBottom` -> `onReachBottom`
- `onPageScroll` -> `onPageScroll`
- `onResize` -> `onResize`
- `onTabItemTap` -> `onTabItemTap`
- `onSaveExitState` -> `onSaveExitState`
- `onShareAppMessage` -> `onShareAppMessage`
- `onShareTimeline` -> `onShareTimeline`
- `onAddToFavorites` -> `onAddToFavorites`

vue3的setup也很丑

```js
import { ref,onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)

    onMounted(() => {
      console.log(count) // 0
    })

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count
    }
  },
}
```

```html
<template>
  <button @click="count++">{{ count }}</button>
</template>
```
