# TS 常量相关

## as const 常量断言

```ts
// 因为 const 常量不会变 因此 ts 直接推断为 'immutableString'
const immutableString = 'immutableString';

// 因为let 变量会变 因此 ts 变宽推断为 string
let mutableString = 'mutableString';
```
- 因为 `const` 常量不会变，因此 `TS` 直接推断为 `'immutableString'`
- 因为 `let` 变量会变，因此 `TS` 变宽推断为 `string`

而对象/数组 项则都可变 `TS` 推断是宽的

这么理解后，我们再来看看这个语句 👇
```ts
const A = ['1', '2']
// type A -> string[]
type Test = typeof A[number]
// type Test -> string

const A = ['1', '2'] as const
// type A -> readonly ['1', '2']

type Test = typeof A[number]
// ✨ type Test -> '1' | '2'
```
有了 `as const` 后更方便我们使用 `数据[xx]` 取出具体的 ✨常量，而不是类型！

### 常见 `use` 工具方法使用 `as const`

```ts
const useFlag = <T>(initVal: T) => {
  let flag: T = initVal
  const setFlag = (newVal: T) => flag = newVal

  return [flag, setFlag]
}

useFlag('1')
```

👇 `TS` 推断结果

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230324153005.png)

👆 `useFlag()` 返回的类型推断为 `(string | ((newVal: string) => void ))[]`

这样也是符合语义的： `[flag, setFlag, flag, flag]` 这种类型

而当我们明确知道这个数组只有2项： `值` 和 `set方法`, 因此可以明确告诉 `TS` 返回值是元组

**解决：**

```ts
const useFlag = <T>(initVal: T): [T, (newVal: T)=>void] => {}
```
👆 1. 手动定义 `useFlag` 函数的返回类型：`[T, (newVal: T)=>void]`

```ts
const useFlag = <T>(initVal: T)=> {
  // ...
  return [flag, setFlag] as [typeof flag, typeof setFlag]
 }
```
👆 2. 手动定义函数内部 `return` 的数据类型：`[typeof flag, typeof setFlag]`

**分析：**

其实从语义层面来分析，`TS` 之所以没能将返回值推断为元组类型是因为它认为该返回值仍有可能被 `push` 值/被修改

👇 所以我们真正需要做的是告诉 `TS`，这个返回值是一个 `final` ，其本身和属性都是不可篡改的，而这正是常量断言 `as const` 所做的事

```ts
const useFlag = <T>(initVal: T)=> {
  // ...
  return [flag, setFlag] as const
}
```

👇 `TS` 推断结果

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230324160455.png)

返回的类型推断为 `readonly [string, (newVal: string) => void ]`

## 数组项常量转类型

```js
const APP = ['a', 'b', 'c'];
```
数组数据 转为 联合类型 👇
```ts
type app = 'a' | 'b' | 'c';
```

步骤：
1. 使用 `as const` 将数据数组变为 `readonly` 的 **元组** 类型
2. `APP` 是数据，因此要用 `typeof` --> `readonly ['a', 'b', 'c']`
3. `readonly ['a', 'b', 'c']` 类型的 `[number]` --> `'a' | 'b' | 'c'`

```ts
const APP = ['a', 'b', 'c'] as const;
type app = typeof APP[number];
// type app -> readonly 'a' | 'b' | 'c'

function getIt(app: app) {}
getIt('a'); // ok
getIt('whatever'); // ❌ not ok
```
👆 `TS` 校验枚举 发生在编译时，运行时不校验

## 对象数据常量转类型

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

👇 使用泛型抽象
```ts
type ValueOf<T> = T[keyof T];
// '123' | '124'
const code: ValueOf<typeof CODE_MAP>
```

取 `value` 而不是取 `key` 因此要用 `数据[key]`

👇 数据转联合类型
```ts
interface Item {
  label: string;
  value: string
}
const A_LIST = [
  { label: '中文A', value: '123' },
  { label: '中文B', value: '124' }
] as const

// ✨ 泛型抽象
type ValueOf<T extends Readonly<Item[]>> = T[number]['value']
type Code = ValueOf<typeof A_LIST>

// '123' | '124'
const code: Code
```

## enum 枚举的运行时代码
```ts
enum A {
  a = '1'
}
enum A {
  b = '1'
}

// 👇
var A;

// ✨ 合并重复的 enum 声明
(function (A) {
    A["a"] = "1";
})(A || (A = {}));

(function (A) {
    A["b"] = "1";
})(A || (A = {}));
```
立即执行的参数，用于合并重复的 `enum` 声明

👇 值是数字时，有 **反向映射** 的运行时代码
```ts
enum A {
  a = 1
}

(function (A) {
    A[A["a"] = 1] = "a"; // ✨ 反向映射 { a: 1, 1: a }
})(A || (A = {}));
```

## enum 维护常量

```ts
interface ListItem {
  label: string
  value: string
}

enum CODE_ENUM {
  codeA = '中文A',
  codeB = '中文B',
}

type CodeType = keyof typeof CODE_ENUM // 'codeA' | 'codeA'

// enum {code: 'label'} --> [{ label:'中文', value:'code' }]
function enumToList(codeEnum: { [key in string]: string }) {
  const arr: ListItem[] = []
  Object.keys(codeEnum).forEach(item => {
    arr.push({ label: codeEnum[item], value: item })
  })
  return arr
}


const list: ListItem[] = enumToList(CODE_ENUM)
const item: CodeType = 'codeA'
const currentLabel = CODE_ENUM[item]
```

🤔 但是，当涉及中文时，不确定会不会有什么中文编码的问题导致 `key` 的索引问题

因此在不考虑中文作 `enum` 枚举 `key` 的前提下

`enum` 的 `key` 也不能是数字/数字字符串：`enum { '2' = 'xxx' }` 不能通过 `tsc` 编译

`code` 枚举是 `数字和中文` 的场景又很常见

## 维护常量实际场景

```ts
interface SelectItem {
  label: string
  value: string | number
}

// 编写一个工具类型：从联合类型中找到想要的某一类型，并提取相应属性 label 的值
type ExtractValue<T, K> = T extends { value: K; label: infer R } ? R : never

const genMapObject = <T extends Readonly<SelectItem[]>>(originData: T) => {
  const codeLabelObj: {
    [K in T[number]['value']]: ExtractValue<T[number], K>
  } = Object.create(null)
  originData.forEach(item => {
    // ;(codeLabelObj as any)[item.value] = item.value
    codeLabelObj[item.value as T[number]['value']] = item.label as ExtractValue<T[number], T[number]['value']>
  })
  return codeLabelObj
}

const A_LIST = [
  { label: '中文A', value: '123' },
  { label: '中文B', value: '124' },
] as const

export const A_OBJECT = genMapObject(A_LIST)

export type T_A_TYPE = keyof typeof A_OBJEC

// page.ts
const t: T_A_TYPE = '123'
const currentFruit = A_OBJECT[t] // '中文A'
```

## 参考材料

[前端常量维护：TypeScript 项目中维护常量引发的思考](https://juejin.cn/post/6876624667533115400)

[索引访问类型（Indexed Access Types）- 冴羽](https://yayujs.com/handbook/IndexedAccessTypes.html)

