[React 组件的受控与非受控](https://zhuanlan.zhihu.com/p/536322574)

[React 表单源码阅读笔记](https://zhuanlan.zhihu.com/p/352181528)


在 [受控组件](./基础.md#受reactstate控组件) 中，我们简单理解

> **非受控组件**：`input` 的状态不受react组件 `state` 中的状态控制，获取和修改 **只允许通过原生dom操作** 输入框的值

```js
const MyInput: FC = props => {
  const [value, setValuel]= useState("")
  return(
    <input
      value={value}
      onChange={ e =>
        setValue(e.target.value)
      }
    />
  )
}

// 使用
<MyInput />
```

👆 这个 `MyInput` 组件有一个内部的状态（State）`value`，而且它没有其他任何属性，因此它是一个非受控的组件

它的组件状态并不受外部环境控制，而是封闭在组件内部

👇 把原本的内部状态 `value` 去掉，放到 `props` 上去，它就变成了受控组件：
```js
const MyInput: FC<{
  value: string
  onChange: (value: string) => void
}> = props => {
  return(
    <input
      value={props.value}
      onChange={ e =>
        props.onChange(e.target.value)
      }
    />
  )
}

// 使用
<MyInput />
```

👇 蓝色的方框表示组件，黄色的圆圈表示组件内的状态：
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308141358328.png)

支持切换受控or非受控

判断是否有传入 value，决定当前是受控还是非受控(使用外部状态还是内部状态)

```js
const MyInput: FC<{
  value: string
  onChange: (value: string) => void
}> = props => {
  const [value, setValuel]= useState("")

  const isControlled = props.value !== undefined

  useEffect(() => {
    // 如果是受控组件 使用外部状态
    if(isControlled) setValuel(props.value)
  })

  return(
    <input
      value={value}
      onChange={ e => {
        // 如果是非受控组件 修改内部状态
        if(!isControlled) {
          setValuel(e.target.value)
        }
        // 受控时就是修改了外部状态value（非受控组件也可以选择不调用外部change
        props.onChange(e.target.value)
      }}
    />
  )
}

// 使用
<MyInput onChange={val=>console.log(val)} />
```
👆 实现了 `MyInput` 组件自动根据是否传入 `value` 切换是否是受控组件

但是存在问题：
1. 原子性：`Child` 内部状态的更新会比 `Parent` 组件晚一个渲染周期，存在 `tearing` 的问题
2. 性能：因为是在 `useEffect` 中通过 `setState` 来做的状态同步，所以会额外的触发一次渲染，存在性能问题

我们其实并不需要 Child 和 Parent 的状态保持非常严格的每时每刻都一致，我们只需要判断，如果组件此时处于受控模式，那么直接使用来自外部的状态就可以了
```js
const MyInput: FC<{
  value: string
  onChange: (value: string) => void
}> = props => {
  const [value, setValuel]= useState("")

  const isControlled = props.value !== undefined

  useEffect(() => {
    // 如果是受控组件 使用外部状态
    if(isControlled) setValuel(props.value)
  })

  return(
    <input
      // 根据是否受控组件 取相应的value，不需要管实时同步 value 和 props.value，只关注其中一个value
      value={isControlled ? props.value : value}
      onChange={ e => {
        // 如果是非受控组件 修改内部状态
        if(!isControlled) {
          setValuel(e.target.value)
        }
        // 受控时就是修改了外部状态value（非受控组件也可以选择不调用外部change
        props.onChange(e.target.value)
      }}
    />
  )
}
```

因为我们是在 useEffect 去做状态同步的，所以自然会额外的多触发一次 Child 组件的重渲染
如果 一些复杂的组件（例如 Picker），多渲染一次带来的性能问题是比较严重的

那有没有办法在 Child 组件的 render 阶段就直接更新 value 状态呢？

👆什么意思？ render阶段更新就不会触发2次吗？

并不可以，React 不允许我们在 render 过程中调用 setState


👇 useState 在组件中的本质：
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202308141457902.png)