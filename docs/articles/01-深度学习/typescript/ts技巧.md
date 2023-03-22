[冴羽-ts](https://github.com/mqyqingfeng/learn-typescript)

ts 同时具有以下功能：
- 静态类型检查(扫描)
- 编译输出js
- 语法降级

👆 我们发现和现在一些工具功能重复如 `编译-webpack`、`降级-babel`

## 纯类型内容时的ts模块化

在 ts 中默认不同文件也会共享 类型空间 和 变量空间, 不会因为不同文件而属于被模块化

如👇  跨文件共享了变量
```ts
// a.ts
const a = 'a'

// b.js
const b = a
```

ts 模块化需要手动编写，只要有 `import/export` 语法就会自动模块化如👇

```ts
// a.ts
export const a = 'a' // <-- 加上 export 后不再共享 a.ts 文件的内容

// b.ts
import { a } from './a.ts' // <-- 因为 a.ts 模块化了，因此需要引入使用，同理加上 import 后 b.ts 文件内容也不再共享
const b = a
```

因此当我们确实编写一个不需要导入导出的 ts 时，可以这么做👇

```ts
export {}

// ... write your ts code
```


## 重写外部依赖的类型声明

```ts
declare module 'foo' { // ✨ 声明的是 module 类型
  // some variable declarations
  export var bar: number;
}
```
👆 当然一般不需要重写，安装对应的 @type 包即可，甚至不用配置，ts 解析器会默认查找 `node_modules/@types` 目录 (可以自定义)

## TS 使用全局变量

前端工程里经常需要使用到一些 `umd` 的第三方库，这些资源挂载在 window 下

当第三方库没有提供 window 下的类型声明时 需要我们自己编写 👇
```ts
declare global {
  const baidu: any // <-- 全局变量：如一些 umd 第三方库
}
```

也可以创建 `global.d.ts`

```ts
interface Window {
  baidu: any // <-- 全局变量：如一些 umd 第三方库
}
```

`d.ts` 的处理都是合并的


## TS 模块化识别非.ts文件

ts 文件引入其他文件模块 如👇 css
```js
import * as foo from './some/file.css'
```

使用 `.d.ts` 库声明文件
```ts
declare module '*.css';
```

一般是创建 `env.d.ts`


## tsConifg 配置引入(继承)方式

在 `vite` 中是

- `.d.ts` 的引用语句是 `/// <reference types="vite/client" />`
- `tsconfig.json` 的引用语句是 `"extends": "@vue/tsconfig/tsconfig.web.json"`

注意 `tsconfig.json` 的 `references`字段 并不是引用语句，而是区分环境的语句 单独再生效一份 `tsconfig` 的功能

## type 和 interface

- `type` - 类型别名
- `interface` - 接口

类型别名和接口非常相似，大部分时候，你可以任意选择使用。接口的几乎所有特性都可以在 `type` 中使用

两者最关键的差别在于 `类型别名本身无法添加新的属性`，而 `接口是可以扩展`的

👇 修改原类型 对一个已经存在的接口添加新的字段
```ts
// Interface
// 对一个已经存在的接口添加新的字段
interface Window {
  title: string
}
interface Window {
  ts: TypeScriptAPI
}
        
// Type
// 创建后不能被改变
type Window = {
  title: string
}
// ❌ Error: Duplicate identifier 'Window'.
type Window = {
  ts: TypeScriptAPI
}
```

👇 扩展类型形成新的类型
```ts
// Type
// 通过交集扩展类型
type Animal = {
  name: string
}

// ✨ &
type Bear = Animal & { 
  honey: boolean 
}
```
`type` 只能用 `&`

👇 `interface` 同时支持 `extends` 和 `&`
```ts
// Interface
// 通过 extends 继承扩展类型
interface Animal {
  name: string
}

// ✨ extends
interface Bear extends Animal {
  honey: boolean
}
// ✨ &
interface Bear = Animal & { 
  honey: boolean 
}
```

`extends` 和 `&` 区别：合并类型出现`key`重复时：
- `extends` 会编译报错
- `&` 不会报错而是自动合并`重复key` 定义的类型

## `!.` 语法

> 非空断言操作符
>
> 表示它的值不可能是 `null` 或者 `undefined`

这是ts语法，不是 ES 语法

用于断言，同 `as` 语法，类似语法糖，断言为 非 `null/undefined`

只有当明确的知道这个值不可能是 `null` 或者 `undefined` 时才使用

并不一定跟 `.` 连用，非空断言操作符 仅指 变量后`!`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230321170217.png)

👇 变量后`!` 即可断言为非 `undefined`
```ts
function a( params: { b?: number }) {
  return b! + 1
}
```

## 枚举会保留到产物里(特殊)

## 函数

👇 创建普通函数
```ts
function a(b: string): number {}
```

👇 创建箭头函数 赋值到变量
```ts
const a = (b: string): number => {}
```
✨ 函数参数的名字 `b` 是必须的

`(string) => number` 指: 参数名是`string` ，类型是 `any`

👇 创建函数的 类型别名 `type` 赋值到变量
```ts
type A = (b: string) => number
const a:A = xxx
```

## 函数参数解构的类型

[变量声明解构-冴羽ts](https://ts.yayujs.com/reference/VariableDeclaration.html#%E8%A7%A3%E6%9E%84)

```ts
// 普通js可以解构出对象参数
function a({ b, c }) {
  console.log(b, c)
}
```

```ts
// ts 不能解构 👇看上去是解构语法，其实是ts的对象类型声明语法
function a(params: { b: string, c?: number }) {
  console.log(params.b, params.c)
}
```

👇 解构函数参数需要写2遍
```ts
function a({ b, c }: { b: string, c: number }) {
  console.log(b + c);
}
```

👇 可以用别名 `type` 简化(本质还是写2遍)
```ts
type BC = { b: string, c: number }
function a({ b, c }: BC) {
  console.log(b + c)
}
```

函数 `args` 技巧

```ts
function fn(...args: [string, ...number[]]) {}

function fn(a: string, ...other: number[]) {}
```

## 函数签名-构造函数、函数重载
### 构造函数

👇 普通对象中一个属性是函数
```ts
interface A {
  a(params: string): number;
  b: string
}
```

👇 构造函数
```ts
interface A {
  (params: string): number;
  b: string
}

const fn: A = () => {}
console.log(fn.b) // <-- 直接调用构造函数的属性
fn()
```

👆 注意这个语法跟函数类型表达式稍有不同，在参数列表和返回的类型之间用的是 `:` 而不是 `=>`

```ts
interface A {
  new (params: string): number;
  (params: string): number;
}

const Fn: A = () => {}
new Fn()
// or
Fn()
```
👆 `new` 构造函数的函数签名语法

### 函数重载

👇 函数只处理1个参数和3个参数，
```ts
function makeDate(timestamp: number): Date; // <-- ✨重载签名 (overload signatures)
function makeDate(m: number, d: number, y: number): Date; // <-- ✨重载签名 (overload signatures)
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date { // <-- ✨实现签名 (Implementation signatures)
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);

const d3 = makeDate(1, 3); // ❌
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```
✨ 实现签名对外界来说是不可见的

当需要重载函数的时候，总是需要来2个以上的重载签名在实现签名之上(最终生效的是重载签名定义的函数类型)


## 函数泛型

👇 泛型的好处(未知的类型)
```ts
function a(arr: any[]): any {
  return arr[0];
}

// 不使用 any
function a<MyType>(arr: MyType[]): MyType | undefined {
  return arr[0];
}
```

**声明泛型的类型**(泛型默认为`any`)：
1. 使用方自定义限制泛型类型
2. 定义方限制泛型类型

👇 使用方自定义限制泛型类型
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230322141145.png)

👇 定义方限制泛型类型
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230322141527.png)
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230322141624.png)

使用 `extends` 拓展(限制)泛型类型 ([不是给泛型的语法](#type-和-interface))


## 对象类型泛型

泛型也用于 `interface` 和 `type`

把 自定义类型开放给使用方

👇 `Array` 类型的定义的 `Array<string>` 等同于 `string[]`
```ts
interface Array<Type> {
  // Gets or sets the length of the array.
  length: number;
 
  pop(): Type | undefined;
  push(...items: Type[]): number;
  // ...
}
```
同理 `Map<K, V>`、`Set<T>`、`Promise<T>`

## vue3 中的泛型应用

👇 `defineProps()` 函数定义泛型类型 **(使用方自定义限制泛型类型)**
```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

// 类型别名简化 等同于👆
interface Props {
  foo: string
  bar?: number
}
const props = defineProps<Props>()
```

👇 `ref()`函数定义泛型类型 **(使用方自定义限制泛型类型)** 或 `Ref<>`类型接收泛型
```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

// 被赋值的变量 用Type定义类型
const year: Ref<string | number> = ref('2020')
// or
// 用函数定义类型，TS 自动推导被赋值的变量类型
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```


## 对象

已知值的类型 未知 `key` 的 `name` 也可以声明类型
```ts
interface Obj {
  [key: string]: number
}
```

索引签名（Index Signatures）

## keyof 类型

```ts
type A = { x: number; y: number };
type B = keyof A; // <-- ✨ 'x' | 'y'
```

👇 `keyof` 结合 `泛型` 使用，对应👆 `A` 对象类型属性未知时
```ts
// extends 定义方限制泛型类型 结合 keyof 限制为 泛型A 的属性
function fn<A, B extends keyof A>(obj: A, key: B) {
  return obj[key];
}
 
let x = { a: 1, b: 2 };
getProperty(x, "m"); // ❌ Argument of type '"m"' is not assignable to parameter of type '"a" | "b"'.
```

## typeof 数据

> 语法 typeof 数据变量 输出-> 类型

👇 `typeof` 对象数据
```ts
const obj = { a: "a", b: "b" }
type Obj = typeof obj;
// type Obj = {
// 		name: string;
// 		age: string;
// }
```

👇 `typeof` 函数数据
```ts
function fn<Type>(params: Type): Type {}
type result = typeof fn;
// type result = <Type>(params: Type) => Type
```

👇 `typeof` 枚举enum(特殊enum会生成运行时代码)
```ts
enum MyEnum {
  No = 0,
  Yes = 1,
}
type result = typeof MyEnum;
// {
//	"No": number,
//  "YES": number
// }
type result = keyof typeof MyEnum; // ✨ 同时使用 keyof typeof
// type result = "No" | "Yes"
```

## 对象类型`[xx]`

> 纯操作 类型

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
       
// type Person = {
//    name: string;
//    age: number;
// }

type Age = typeof MyArray[number]["age"];  
// type Age = number

// Or
type Age2 = Person["age"];   
// type Age2 = number
```

👇 用于 `数组枚举` 场景

```js
const APP = ['TaoBao', 'Tmall', 'Alipay'];
```
转为
```ts
type app = 'TaoBao' | 'Tmall' | 'Alipay';
```

1. 使用 `as const` 将数据数组变为 `readonly` 的 **元组** 类型
2. `APP` 是数据，因此要用 `typeof` 得到 `readonly ["TaoBao", "Tmall", "Alipay"]`
3. `readonly ["TaoBao", "Tmall", "Alipay"]` 类型的 `[number]` 取出来就是 `"TaoBao" | "Tmall" | "Alipay"`
```ts
const APP = ['TaoBao', 'Tmall', 'Alipay'] as const;
type app = typeof APP[number];
// type app = "TaoBao" | "Tmall" | "Alipay"

function getPhoto(app: app) {}
getPhoto('TaoBao'); // ok
getPhoto('whatever'); // ❌ not ok
```
👆 在编译时校验枚举，运行时不校验

用枚举 `enum` 实现则会生成运行时代码

👇 数据转联合类型
```ts
const CODE_MAP = {
  A: '123',
  B: '124',
} as const;

// '123' | '124'
type code = typeof CODE_MAP[keyof typeof CODE_MAP]
```

取 `value` 而不是取 `key` 因此要用 `数据[key]`

