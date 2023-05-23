# umi qiankun 微前端通信

[@umijs/plugin-qiankun](https://umijs.org/zh-CN/plugins/plugin-qiankun)

> 配合 [useModel](https://umijs.org/zh-CN/plugins/plugin-model) 使用（推荐）

> 需确保已安装 `@umijs/plugin-model` 或 `@umijs/preset-react`

因为文档推荐的通信方式是 `@umijs/plugin-model`

但是 `package.json` 没有看到安装，以为不能用

结果看到入口 `app.tsx` 导出的 `getInitialState` 使用到 [@umijs/plugin-initial-state](https://v3.umijs.org/zh-CN/plugins/plugin-initial-state)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230523171737.png)

> **这个插件不可直接使用，必须搭配 @umijs/plugin-model 一起使用**。

也就出说项目已经有在用了，只是看不到...

## @umijs/plugin-model

> 约定在 `src/models` 目录下的文件为项目定义的 `model` 文件

> 每个文件需要默认导出一个 `function`，该 `function` 定义了一个 `Hook`，不符合规范的文件我们会过滤掉。

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230523171658.png)

👇 `src/models/xxx.js`
```js
import { useState } from 'react'

export default function useUser() {
  const [user, setUser] = useState(null)

  return {
    user,
    setUser
  }
}
```

`models` 目录下的文件名作为 `state` 的 `nameSpace`

👇 通过插件(安装后都从 `umi` 中引入) `useModel(nameSpace)` 使用
```jsx
import { useModel } from 'umi'

export default () => {
  const { user, setUser } = useModel('xxx')
  console.log(user)
}
```

## @umijs/plugin-qiankun

### 微应用

> 微应用中会自动生成一个全局 model，可以在任意组件中获取主应用透传的 props 的值。

👆 全局 `model` 的 `nameSpace` 是 `@@qiankunStateFromMaster`

✨ 这里的 `nameSpace` 等同于 上面 `@umijs/plugin-model` 约定在 `src/models` 目录下的文件为项目定义的 `model` 文件

```js
import { useModel } from 'umi'

function MyPage() {
  const masterProps = useModel('@@qiankunStateFromMaster')
}
```

### 主应用

> 在 `src/app.ts` 里导出一个 `useQiankunStateForSlave` 函数，函数的返回值将作为 props 传递给微应用

👇 `src/app.ts`
```js
export function useQiankunStateForSlave() {
  const [masterState, setMasterState] = useState({
    showFlag: false // <-- ✨ 设置初始值
  });

  return {
    masterState,
    setMasterState,
  };
}
```

## 通信
因为环境(插件依赖`@umijs/plugin-qiankun、@umijs/plugin-model`)已经完善

直接主应用入口定义并导出 `useQiankunStateForSlave()`
👇 `src/app.ts`
```js
export function useQiankunStateForSlave() {
  const [masterState, setMasterState] = useState({
    showFlag: false // <-- ✨ 设置初始值
  });

  return {
    masterState,
    setMasterState,
  };
}
```

子应用环境(插件依赖`@umijs/plugin-model`)同样已经完善

👇 直接在业务页面组件中调用修改状态的 `set` 函数
```js
import { useModel } from 'umi'

export default function Page1() {
  const {masterState, setMasterState}= useModel('@@qiankunStateFromMaster')

  setMasterState({showFlag: true}) // <-- ✨ 修改showFlag为true
}
```
👆 即可使主应用的 `showFlag` 变为 `true` 触发主应用组件更新渲染

## 子应用独立运行时的状态控制

因为同时需要考虑子应用独立运行时的状态管理

因此子应用页面修改状态需要区分一下运行环境：
- 当运行在 `qiankun` 微前端容器时，则修改主应用的 `state`
- 当独立运行时，则修改子应用项目的 `state`

尝试子应用创建 `src/models/@@qiankunStateFromMaster.js` 不侵入业务代码，由 `umi` 自动识别优先级：
- 子应用独立运行时，无主应用注入的全局 `state`，使用本地项目的 `src/models`
- 子应用运行在微前端容器时，自动无视子应用项目创建的 `state`，使用主应用的 `state`

尝试失败 ❌， `@umijs/plugin-model` 不允许使用 `@@qiankunStateFromMaster`、`@@initialState` 做文件名(`nameSpace`)

那就只能侵入业务代码，运行时判断当前子应用运行的环境，使用不同的 `state`

子应用创建一个 `state` (和主应用的状态保持一致)

👇 `src/models/xxx.js`
```js
import { useState } from 'react'

export default function subAppModel() {
  const [masterState, setMasterState] = useState({
    showFlag: false
  })

  return {
    masterState,
    setMasterState
  }
}
```

👇 封装一个 `Hook` 根据运行环境操作对应的 `state`
```js
import { useQianKun } from "@/utils/hooks"
import { useModel } from "@umijs/max"

export function useState() {
  const inqiankun = useQianKun() // 判断子应用运行环境
  const stateModelNamespace = inqiankun ? '@@qiankunStateFromMaster' : 'xxx'
  return useModel(stateModelNamespace)
}
```

👇 子应用页面使用
```js
const { setMasterState } = useState()

setMasterState({showFlag: true})
```