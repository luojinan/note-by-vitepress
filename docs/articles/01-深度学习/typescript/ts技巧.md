[ts 问题](https://tate-young.github.io/2021/01/21/ts-update.html)

## TS 使用全局变量

因为 ts 项目的全局变量全部来源于显式的代码定义，当使用一些其他渠道定义的全局变量，ts 将不认识如：👇
1. HTML 通过 `<srcipt>` 引入 umd 模块
2. 编译器环境变量工具 `webpack-defind`
3. ...

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

## 重写第三方依赖的类型声明

```ts
declare module 'jquery' { // ✨ 声明的是 module 类型
  // some variable declarations
  export var bar: number;
}
```

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

## new Map

把对象数组通过 map 转为 二维数组给到 new Map()，会提示不是 readonly，并且不会自动推断 二维数组里的项是string 而是 unknow
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/202306121422114.png)

```ts
const list = res.map(item => {
  return [item.code, item.value] as const // ✨
})

new Map(list)
```

数组转为 `as const` 后成功推断


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


```ts
const foo = <T,>(x: T): T => x;

const foo = <T extends {}>(x: T): T => x;

const foo = <T extends Record<string, unknown>>(x: T): T => x;

const foo: <T>(x: T) => T = x => x;

const identity = <T,>(arg: T): T => {
    console.log(arg);
    return arg;
};

const renderAuthorize = <T>(Authorized: T): ((currentAuthority: CurrentAuthorityType) => T) => (
    currentAuthority: CurrentAuthorityType,
  ): T => {
     return
 };
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

## Promise 泛型

返回 `Promise` 的工具函数, `resolve` 的数据类型需要通过泛型定义

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230323promisets.gif)

👆 `res` 为 `unknow`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230323promisets2.gif)

使用方自定义 `Promise` 返回数据结构 泛型`<FnResult>`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230323144759.png)

定义方声明了 `Promise` 的返回类型是 `泛型T` 因此 TS 认为 `{data: ''}` 不符合泛型

❌ 可以扩展泛型解决 TODO: 

[TS Playground](https://www.typescriptlang.org/zh/play?jsx=0&ts=5.0.2#code/JYOwLgpgTgZghgYwgAgGIgEoQM4FcA2YyA3gFDLIAmcYcAXMtmFKAOakC+ppCA9iE2QwQyALzIAPABUAfAAoAlAwAKUXgFtg2CNJli9ZClAhhcUESAgB3ZKo1aIcucmPZe+AG4oF+kuQrIfAJErgzoWHiEYiRUNPTIAOSApcaAx8qAK-GAe2qAIW6ADqaAdsYJyFwBLjjuXnKuCv4c1VykwhLhOARg8goAdGAAFhAgTqXYyD6iekFu+BAd+LyslTgd1LQKCkA)

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

```ts
const APP = ['a', 'b', 'c'] as const;
// 'a' | 'b' | 'c'
type app = typeof APP[number];
```

## vue3 的 ts 拓展功能

[vue3 ts](https://zhuanlan.zhihu.com/p/75922973)

### readonly

> 可以把每个属性都变成只读

```ts
type A  = {a:number, b:string}
type A1 = Readonly<A> // {readonly a: number;readonly b: string;}
```

👇 原理实现
```ts
type Readonly<T> = {
  readonly [key in keyof T]: T[key];
};
```

1. 定义一个支持泛型的类型别名, 传入类型参数T
2. 通过keyof获取T上的键值集合 `'a' | 'b'`
3. 用in表示循环keyof获取的键值
4. 添加readonly标记

```ts
type A  = {a:number, b:string}
type A1 = Partial<A> // { a?: number; b?: string;}

type Partial<T> = {
  [key in keyof T]?: T[key];
};
```
Required\, 让属性都变成必选
```ts
type A  = {a?:number, b?:string}
type A1 = Required<A> // { a: number; b: string;}

type Required<T> = {
  [key in keyof T]: T[key];
};
```
Pick, 只保留自己选择的属性, U代表属性集合
```ts
type A  = {a:number, b:string}
type A1 = Pick<A, 'a'> //  {a:number}

type Pick<T, KEY extends keyof T> = {
  [NewKey in KEY]: T[NewKey];
};
```
Omit 实现排除已选的属性
```ts
type A  = {a:number, b:string}
type A1 = Omit<A, 'a'> // {b:string}
```
Record, 创建一个类型,T代表键值的类型, U代表值的类型
```ts
type A1 = Record<string, string> // 等价{[k:string]:string}
```
Exclude, 过滤T中和U相同(或兼容)的类型
```ts
type A  = {a:number, b:string}
type A1 = Exclude<number|string, string|number[]> // number

// 兼容
type A2 = Exclude<number|string, any|number[]> // never , 因为any兼容number, 所以number被过滤掉
```
Extract, 提取T中和U相同(或兼容)的类型
```ts
type A  = {a:number, b:string}
type A1 = Extract<number|string, string|number[]> // string
```


```ts
Record<string, string>
// 等价于
{[key: string]: string}

// what about ?
{ [key in string]: string }
```
```ts
type T1 = {[key: string]: null}; // ✨ 数字作 key 被认为符合
type T2 = {[key in string]: null}; // ✨ 数字不可作 key

const t1: T1 = {'foo': null, 10: null};
const t2: T2 = {'foo': null, 10: null};

type S1 = keyof T1; // string | number
type S2 = keyof T2; // string

const s1: S1 = 10;
const s2: S2 = 10; // error
```

```ts
type T1 = {[key: string]: null};
type T2 = {[key in string]: null};

type T1opt = {[key: string]?: null}; // invalid syntax
type T2opt = {[key in string]?: null};

```

```ts
// This is "[key in string]" and not "[key: string]" to allow CSSObject to be self-referential
```
using in apparently allows for self-reference, as seen in [@types/styled-components/index.d.ts#24:](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/styled-components/index.d.ts#L24)


## 定时器

[setTimeout() 函数的TypeScript返回类型](https://juejin.cn/post/7008043042280046599)

```js
const [intervalItem,setIntervalItem] = useState<number>()
```
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230524110849.png)

👇 用 window 并定义成number 类型
```js
const [intervalItem,setIntervalItem] = useState<number>()

// 轮询
const interval = window.setInterval(()=>{
  console.log('dd')
}, 2000)
setIntervalItem(interval)
```