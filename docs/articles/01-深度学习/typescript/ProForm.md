
## proForm

根据type的值，提供attrs的类型提示

### 普通类型声明尝试

定义一些基础的类型和接口

```typescript
// 定义不同valueType对应的属性类型
interface A {
  a: string;
}
interface B {
  b: number;
}

// 定义一个类型，将valueType映射到对应的attrs类型
type TypeMap = {
  a: A;
  b: B;
};
```

👇 实现 ProFormColumn 支持多种type和attrs

```typescript
export interface ProFormColumn {
  type?: keyof TypeMap;
  attrs?: TypeMap[keyof TypeMap];
}
```

👇 结果

```ts
const aColumn: ProFormColumn = {
  type: 'a',
  attrs: {
    a: 'a', // ✅ ts提示通过
    c: 'c', // ❌ ts提示，没有key为c的定义
    b: 1, // ✅ ts提示通过
  }
}
```

👇 把鼠标悬浮上去发现 attrs 为 `A|B`

这是因为 `attrs?: TypeMap[keyof TypeMap];` 传入的 `keyof TypeMap` 是 `'a'|'b'`，而不是实际使用时传入的 `type` 的值

### 动态类型实现

修改ProFormColumn，不再是一个普通的对象类型

```ts
type ProFormColumn = {
  [K in keyof TypeMap]: {
    type: K;
    attrs: AttrsByType<K>;
  };
}[keyof TypeMap]
```

👆 得到的 ProFormColumn 将会是动态生成的联合类型 `{type: 'a', attrs: A} | {type: 'b', attrs: B} | ...`

这与一开始的 `{ type: 'a'|'b', attrs: A|B }` 不同，相当于声明多种对象类型，且type不是任选的，只能是这些多种对象类型中的一种

👇 结果

```ts
const aColumn: ProFormColumn = {
  type: 'a', // ✨ 命中ProFormColumn多种对象中type为'a'的对象声明
  attrs: { // ✨ 鼠标悬浮显示 A
    a: 'a', // ✅ ts提示通过
    c: 'c', // ❌ ts提示，没有key为c的定义
    b: 1, // ❌ ts提示，没有key为b的定义
  }
}
```

### type 非必填，设置默认值 - 失败

似乎无论怎么修改，都没办法让不传入type时，attrs类型取到A

```ts
type ProFormColumn = {
  [K in keyof TypeMap]: {
    type: K;
    attrs: AttrsByType<K>;
  } | {
    attrs: A
  }
}[keyof TypeMap]
```

👆 虽然 `ProFormColumn` 多了一种对象声明没有type，但是在最终使用时的attrs为多种attrs的总和

可能因为ts会把attrs所有可能的情况都整合起来，必须手动收窄才能有命中对应的类型，没办法在type不提供时准确定位到类型

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241113134709344.png?x-oss-process=image/format,webp/resize,w_640)

所以如何希望在不设置 `type` 的情况下，让 `attrs` 类型为A，只能在编写时，先显式设置 `type` 为 `'a'` ，在得到attrs类型帮助下编写 `attrs`，编写完成后再删除`type`

## element plus

在 element plus 中这样抛出组件声明 `InputProps`

`export declare type InputProps = ExtractPropTypes<typeof inputProps>;`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241113100947848.png?x-oss-process=image/format,webp/resize,w_640)

[ExtractPropTypes类型工具 - Vue3官方文档](https://cn.vuejs.org/api/utility-types#extractproptypes)

用于提取vue组件中运行时语法的props类型

```ts
const propsOptions = {
  foo: String,
  bar: Boolean,
  baz: {
    type: Number,
    required: true
  },
  qux: {
    type: Number,
    default: 1
  }
} as const

type Props = ExtractPropTypes<typeof propsOptions>
// {
//   foo?: string,
//   bar: boolean,
//   baz: number,
//   qux: number
// }
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241112212219475.png?x-oss-process=image/format,webp/resize,w_640)

## ProTable

使用泛型组件，表格列的类型由getList接口响应结果决定

```vue
<script setup lang="ts" generic="T, R extends IObject">
// 泛型T 为列表request的结果Item类型
// 泛型R 为columns配置项显式定义的Item类型 - 在template 中编写时会自动推断为T，当在ts中编写则需要显式定义
// ✨最佳实践：鼠标悬浮查看templace中<ProTable>的columns属性，显示内部推断的Item类型，复制到ts中显式定义按要求使用类型
import type { ProTableColumn, IObject } from '../type'

const props = defineProps<{
  request: (params: any) => Promise<{ list: T[], total: number } | T[]>
  columns: ProTableColumn<R extends T ? R : T>[]
}>()
</script>
```

泛型T 为列表request的结果Item类型

泛型R 是条件语句，始终命中T，如果不写条件语句，会覆盖T的泛型定义，导致request定义的T无效
