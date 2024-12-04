# vue3 + ts

vue3 的语法本就过于灵活，外加各种写法来解决一些特定场景，导致ts的写法也多种多样，我们基于vue3.5(宏编辑和语法糖相对稳定的版本)来记录常用的ts定义

注意：为减少心智负担，只记录可以通用的写法，哪怕不是最优解，当遇到无法声明的特殊情况，请查看官方文档(更全面且看着头大)

## props

在vue3中，设置props **默认值** 和 **ts定义** 一直很繁琐

但是 `vue3.5` 后开始支持解构设置默认值（靠编译实现，原理另外记录），基本是最优解了

```ts
const { a = 'a', b = 1 } = defineProps<{
  a?: string
  b?: number
}>()

// or
const props = defineProps<{
  a?: string
  b?: number
}>()
const { a = 'a', b = 1 } = props
```

👇 剥离ts类型后

```js
const { a = 'a', b = 1 } = defineProps()

// or
const props = defineProps()
const { a = 'a', b = 1 } = props
```

[官网文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props)

## emits

```ts
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

emit('change', 1)
emit('update', 'a')
```

这个 `defineEmits` 看起来很反直觉。传入的泛型像是一个对象，但调用时却不是对象

这里需要引入一个相对复杂的ts语法-函数重载，我们先不管类型

```js
const emit = defineEmits()

emit('change', 1)
emit('update', 'a')
```

👇 不管 `defineEmits()` 在做什么，最终我们会得到一个未执行的函数 `emit`

如果我们希望给这个未执行的函数声明类型

```ts
const emit = defineEmits() as (name: 'change'|'update', param: number|string): void

emit('change', 1)
emit('update', 'a')
```

这样虽然声明了类型，但是如果希望当`name`为`change`时 `param`为`number`不能为`string`就不行

👇 所以引入了函数重载的概念，允许给一个函数声明多种参数类型，互不干扰

```ts
const emit = defineEmits() as {
  (e: 'change', id: number): void;
  (e: 'update', value: string): void;
}

emit('change', 1)
emit('update', 'a')
```

虽然包在一个 `{}` 里，但这不是一个对象类型或数组类型

👇 由此我们也可以推断出 `emit` 执行时在做什么

```ts
function emit(e: 'change' | 'update', param: number | string): void {
  if (e === 'change') {
    // 在这里，param 被 TypeScript 识别为 number 类型
    console.log(param as number);
  } else if (e === 'update') {
    // 在这里，param 被 TypeScript 识别为 string 类型
    console.log(param as string);
  }
}
```

> 在 TypeScript 中，函数重载允许你定义多个具有相同参数形式的函数，但参数类型不同
>
> TypeScript 编译器会根据调用函数时提供的参数来决定使用哪个重载的实现
>
> 每个重载(`type {}`内的单个函数类型)定义了当 name 是特定值时，第二个参数的类型以及函数的返回类型

👇 也可以窥见 `defineEmits` 在内部定义了个内存空间来暂存不同的`emit`，最后统一管理分发调用

```js
function defineEmits() {
  return (name, ...params) => {
    if (name === 'change') {}
    else if (name === 'update') {}
    // else if ...
  }
}
```

[官网文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-emits)

TODO: 组件函数参数丢失

## ref 组件/dom

自定义组件实例类型

一般情况下，我们编写父子组件不需要prop外的类型定义，那种时候普通的ref绑定dom，是会自动推导的，只写 `const childRef = ref()`，让ts自动推断

1. 如果需要非props外的类型，如html类型时

`useTemplateRef()` 创建的 ref 类型可以基于匹配的 ref attribute 所在的元素自动推断为静态类型

👆 相当于dom类型加强版的的`ref()`

注意：使用 `useTemplateRef()` 绑定组件，也只会推断为普通dom元素类型

2. 如果ref绑定的dom连props等类型的不能自动推导时，需要显式定义类型，通过`InstanceType<typeof X>` 来获取自定义组件类型

即：在无法自动推断的情况下 (如非单文件组件使用或动态组件)

可以通过泛型参数将模板 ref(自动推断) 强制转换为显式类型

为了获取导入组件的实例类型，我们需要先通过 typeof 获取其类型，然后使用 TypeScript 的内置 InstanceType 工具提取其实例类型：

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo> // 自定义组件实例类型
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp') // 给ref定义类型
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

## 泛型组件

[Vue 3.3 泛型组件类型识别错误的解决](https://www.luckystarry.com/document/ART09087D63MOQV4)

我们希望自定义组件内部各种逻辑能共享一个外部传入的泛型类型，如一个 Info 组件，提供给多种数据类型渲染

如接口A返回`{a:'a'}` 接口B返回`{b:1}`，此时我们希望Info组件在不同接口数据时，内部逻辑可以推断出接口A场景的数据类型只有a字符串，接口B场景的数据类型只有数字b

```vue
<script setup lang="ts" generic="T">
import { ref } from 'vue'

const { info } = defineProps<{info: T}>()

const innerData = ref<T>() // info的类型由外部决定

const doSometing = (param: T) => (innerData.value = param)

defineExpose({
  doSometing
})
</script>
```

使用泛型组件

```vue
<script setup lang="ts">
const childRef = ref()

childRef.value.doSometing({a: 'a'}) // 报错 param 类型为 {b: number}，因为组件参数info为{b:1}
</script>

<Child ref="childRef" :info="{b: 1}" />
```

反直觉的地方是给泛型组件传递泛型的方式，👆可以看到父组件没有使用`<类型>`这种方式传递给子组件，而是子组件自己推断出父组件会传什么类型进来....

而在react 的 tsx中，父组件传递的泛型就很清晰

```tsx
<Child<{b:number}>
  ref=""
  info={ {b:1} }
/>
```

## 函数重载(defineEmits)

每个重载定义了当 `e` 是特定值时，第二个参数的类型以及函数的返回类型。

```typescript
type EventHandler = {
  (e: 'change', id: number): void;
  (e: 'update', value: string): void;
};
```

这个 `EventHandler` 类型定义了两种函数签名：

1. 第一个重载：

   ```typescript
   (e: 'change', id: number): void;
   ```

   这个签名表示，当 `e` 参数是字符串 `'change'` 时，第二个参数 `id` 应该是 `number` 类型，函数不返回任何值（`void`）。

2. 第二个重载：

   ```typescript
   (e: 'update', value: string): void;
   ```

   这个签名表示，当 `e` 参数是字符串 `'update'` 时，第二个参数 `value` 应该是 `string` 类型，函数同样不返回任何值（`void`）。

在 TypeScript 中，函数重载允许你定义多个具有相同名称的函数，但参数列表不同。TypeScript 编译器会根据调用函数时提供的参数来决定使用哪个重载的实现。

例如，如果你有一个实现了 `EventHandler` 类型的函数，它可能看起来像这样：

```typescript
function handleEvent(e: 'change' | 'update', param: number | string): void {
  if (e === 'change') {
    // 在这里，param 被 TypeScript 识别为 number 类型
    console.log(param as number);
  } else if (e === 'update') {
    // 在这里，param 被 TypeScript 识别为 string 类型
    console.log(param as string);
  }
}
```

在这个 `handleEvent` 函数中，尽管我们只有一个函数体，我们通过检查 `e` 的值来决定如何处理 `param`

所以函数重载允许你编写，根据输入参数的不同而执行不同逻辑的函数

## 组件类型在templact和script中丢失

### 父子组件props校验

👇 Child子组件

```ts
defineProps<{
  info: {a: string}
}>()
```

👇 父组件在 template 中编写props

```html
<!-- ✨ 编写info时得到ts提示 -->
<Child :info={ a: 'a' } />
```

👇 父组件在 script 中编写props

```html
<script lang="ts" setup>
const result = {a: 1} // ❌ 编写传递给info的result数据时得不到ts提示
</script>

<Child :info={result} /> //  ✅ 传递错误的info类型会得到ts提示 Type '{ a: number; }' is not assignable to type '{ a: string; }'.
```

在把变量/逻辑和template分开的写法下

编写vue组件时在script里依然不能得到最完善的ts提示，要到template中查看类型是否正确，script的中info数据则只会被ts自动推断为任意编写的类型

> 值得注意的是，在 React 里，把变量/逻辑和template分开的写法下，则连tsx 部分都不会有类型提示
>
> 这也是很多人会顺手把很多变量/逻辑写在tsx中，而懒得抽离ts里的原因

解决办法：鼠标悬浮到template 中的prop查看类型定义，复制到script中给自己的变量显式定义类型，而不是不理他

### 父子组件emits/exports校验

但是组件传递函数就丢失的更彻底了

```ts
defineEmits<{
  (e:'test', id: string): void
}>()
```

👇 父组件在 template 中编写 `@test`

```html
<!-- ✨ 编写info时得到ts提示 id是字符串不存在toFixed -->
<Child @test="(id) => id.toFixed(2)" />
```

👇 父组件在 script 中编写props

```html
<script lang="ts" setup>
const onTest = (id) => id.toFixed(2) // ❌ 编写传递给test的函数，得不到ts提示，id被推断为any
</script>

<Child @test="onTest" /> //  ❌ 传递错误的函数不会有ts提示
```

在把逻辑和template分开的写法下

不会有任何的类型校验，只会有ts自带的提醒，函数onTest存在any类型

> 值得注意的是，在 React 里，把逻辑和template分开的写法下也存在相同的问题

解决办法：鼠标悬浮到template 中的 `@test` 查看类型定义，复制到script中给自己的函数显式定义类型，而不是不理他
