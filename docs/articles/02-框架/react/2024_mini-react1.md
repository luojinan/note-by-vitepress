2024 [React18底层源码](https://coding.imooc.com/class/818.html)

::: details 目录

```text
第1章 课程介绍

第2章 学前技术储备：React核心知识点讲解
2-1 为什么要学习React源码
2-2 React的迭代历史：那些标志性的变革，如类组件、Fiber、Hooks、Concurrent等
2-3 Thinking in React，即用React的方式写React-1
2-4 Thinking in React，即用React的方式写React-2
2-5 React中的状态管理与状态管理库-1
2-6 React中的状态管理与状态管理库-2
2-7 state (状态)与props (属性)
2-8 React中的组件，如函数组件、类组件等
2-9 Hooks
2-10 Context
2-11 React脚手架以及企业级框架
2-12 React 组件的常见性能优化-1
2-13 React 组件的常见性能优化-2
2-14 React 组件的常见性能优化-3

第3章 学习前：底层源码的高效学习方法分享
3-1 -1 如何高效学习React源码
3-2 -2 如何高效学习React源码
3-3 如何debug React源码
3-4 如何运行React测试用例
3-5 如何成为React Contributor

第4章 代码实践：打造轮子，自己的mini react框架
4-1 造轮子的优势以及步骤
4-2 搭建自己的mini react项目

第5章 React18全新底层核心运行机制：任务调度机制的代码实践
5-1 实现任务调度算法-1
5-2 实现任务调度算法-什么是最小堆-2
5-3 实现任务调度算法-实现最小堆的peek与push函数-3
5-4 实现任务调度算法-实现最小堆的pop函数-4
5-5 任务调度器scheduler
5-6 如何实现时间切片
5-7 如何实现任务调度函数入口.mp4
5-8 如何实现一个requestIdleCallback.mp4
5-9 如何调度延迟任务
5-10 总结：源码实践React底层任务调度机制

第6章 React18全新底层核心运行机制：任务调度机制源码阅读，思维拔高
6-1 剖析React中的任务调度器场景：合作式调度器 & 抢占式调度器
6-2 剖析React任务调度源码

第7章 React渲染机制：原始渲染VDOM与性能改革Fiber的源码剖析
7-1 VDOM的四大问题：what、why、where、how
7-2 -1 Fiber详解
7-3 -2 Fiber详解
7-4 掌握不同类型组件的Fiber：查看并调试

第8章 React渲染机制：React中初次渲染流程深度剖析
8-1 在浏览器DOM 节点中创建根节点：createRoot -1
8-2 -2 在浏览器DOM 节点中创建根节点：createRoot
8-3 -3 在浏览器DOM 节点中创建根节点：createRoot
8-4 -4 在浏览器DOM 节点中创建根节点：createRoot
8-5 -1 root.render与unmount函数的流程
8-6 -1 root.render与unmount函数的流程
8-7 -1 update的数据结构与算法.mp4
8-8 -2update的数据结构与算法.mp4
8-9 -1 scheduleUpdateOnFiber调度更新.mp4
8-10 -2 scheduleUpdateOnFiber调度更新
8-11 -3 scheduleUpdateOnFiber调度更新
8-12 render阶段
8-13 render阶段-beginWork
8-14 render阶段-renderRootConcurrent
8-15 commit阶段

第9章 React渲染机制：页面初次渲染原生标签代码实践

第10章 React渲染机制：手写不同组件的渲染过程，掌握其机制原理
10-1 如何实现多个原生标签子节点渲染的源码.mp4
10-2 如何实现文本节点渲染的源码.mp4
10-3 如何实现Fragment渲染的源码.mp4
10-4 如何实现类组件渲染的源码.mp4
10-5 实现函数组件渲染的源码.mp4

第11章 React开发的利器：Hooks底层分析
11-1 Hook简介
11-2 Hook规则背后的原因.mp4
11-3 函数组件的Hook源码解读.mp4
11-4 -1 useReducer源码解读.mp4
11-5 -2 useReducer源码解读
11-6 useState源码解读

第12章 React开发的利器：手写实现Hooks，掌握Hooks底层数据结构
12-1 模拟事件，初步实现useReducer
12-2 实现useReducer，掌握Hooks的底层结构实现与函数组件的状态-1
12-3 实现useReducer，掌握Hooks的底层结构实现与函数组件的状态-2
12-4 节点删除.mp4
12-5 初步实现多个节点的React VDOM DIFF-1
12-6 初步实现多个节点的React VDOM DIFF-2
12-7 完善实现React VDOM DIFF算法
12-8 如何移动DOM节点
12-9 实现useState.mp4
12-10 子节点为null、undefined、布尔值

第13章 React开发的利器：React VDOM DIFF算法源码剖析
13-1 分析不同子节点类型，React VDOM DIFF的处理
13-2 协调单个节点
13-3 协调多个子节点
13-4 协调文本节点
13-5 拓展-与Vue3 VDOM DIFF对比

第14章 React开发的利器：Hooks进阶，代码实践手动实现API
14-1 如何实现useMemo
14-2 如何实现useCallback
14-3 useMemo与useCallback
14-4 如何实现useRef
14-5 如何实现useLayoutEffect
14-6 如何实现useLayoutEffect的effect执行
14-7 如何实现useEffect的effect执行.mp4

第15章 React中的数据模式：代码实现，掌握Context实现原理
15-1 知识分析：Context简介
15-2 实现Context，掌握Context的底层结构与源码实现.mp4_音频.mp3
15-3 实现Provider，掌握其底层实现.mp4
15-4 实现useContext与Context与Value管理，掌握其数据结构.mp4_音频.mp3
15-5 实现Consumer.mp4
15-6 实现contextType，掌握类组件对于Context消费方式的原理

第16章 React中的数据模式：Context源码剖析，思维提高
16-1 分析Context的底层结构与源码实现
16-2 分析Provider与Context value栈管理，掌握其底层实现
16-3 分析Provider与后代组件消费context value
16-4 后代组件消费的三种方式

第17章 跨浏览器兼容的事件系统：合成事件源码剖析
17-1 React中的合成事件背景与其必要性
17-2 React中的事件注册
17-3 React中的事件绑定与事件委托
17-4 React中的事件派发（上）
17-5 React中的事件派发（下）
17-6 React合成事件的定义
17-7 不适合事件委托的事件处理

第18章 跨浏览器兼容的事件系统：合成事件实践，掌握框架级别的事件
18-1 实现事件注册
18-2 实现事件绑定与事件委托
18-3 -1实现事件派发
18-4 -2实现事件派发
18-5 实现合成事件
18-6 实现受控组件事件.mp4

第19章 性能提高：React Lanes模型源码剖析
19-1 React Lanes模型背景
19-2 React Lanes模型的应用
19-3 React Lanes 模型常用工具函数
19-4 React18新增的transition
19-5 useDeferredValue原理

第20章 性能提高：React Lanes模型手动实践
20-1 -1 实现memo
20-2 -2 实现memo
20-3 补充受控组件事件
20-4 实现lanes模型

第21章 课程总结
21-1 课程总结.mp4
21-2 拓展：哪些React未正式发布的功能
```

:::

## 搭建项目

### monorepo 环境

👇 构建目录

monorepo 基于 pnpm

```shell
mkdir an-mini-react && cd an-mini-react && pnpm init

mkdir packages && cd packages

mkdir react && cd react && pnpm init && cd ..
mkdir react-dom && cd react-dom && pnpm init && cd ..
mkdir react-reconciler && cd react-reconciler && pnpm init && cd ..
mkdir scheduler && cd scheduler && pnpm init && cd ..
mkdir shared && cd shared && pnpm init && cd ..
```

新建 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

👇 安装公共依赖

```shell
pnpm add vitest -Dw
```

👇 共享项目内repo

安装 `shared` 给 `scheduler` 使用

```shell
pnpm add shared --filter scheduler
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20241204162247834.png?x-oss-process=image/format,webp/resize,w_340)

### demo 环境

基于vite，`pnpm create vite 目录名 --template 模板枚举`

```shell
pnpm create vite examples --template react-ts
cd examples
pnpm i
pnpm dev
```

## 实现任务调度算法

前置知识：算法

```text
给你一个数字数组[1,2,3,4,5,6]，找出最小的数字，怎么解？

1. Array.sort
2. 遍历比较找出最小值

如果这个数组是动态的，找到之后就从数组里删除这个元素，并且这个过程中，还会不断有新的数字插入数组

Array.sort - 每次 sort，只取第一个，耗时把第二和第一万都排那么准确，是无用的
```

为了解决这个问题，我们可以使用一个最小堆（Min Heap）来保持最新的k个最大元素。最小堆的根节点将始终是这k个元素中最小的那个，也就是第k大的元素。

### 最小堆

堆是一种特殊的二叉树，满足以下性质：

- `完全二叉树`：除了最后一层外，其他每一层都被完全填充，并且所有节点都尽可能靠左排列。
- `最小堆`：是一种经过排序的 `完全二叉树`，父节点的值总是 `小于或等于` 其子节点的值
- `最大堆`：是一种经过排序的 `完全二叉树`，父节点的值总是 `大于或等于` 其子节点的值

用普通 **一维数组** 来表示堆，而不是实际构建一棵二叉树（这是因为完全二叉树可以用数组高效地表示，而不需要额外的空间来存储指针）

#### 逐步构造最小堆数据结构

假设我们有一个数组`[4, 5, 8, 2]`，我们要把它构建成一个最小堆

1. **插入元素并上浮**
   - 插入`4`，因为是第一个元素，直接作为根节点。
   - 插入`5`，作为`4`的左子节点。
   - 插入`8`，作为`4`的右子节点。
   - 插入`2`，需要与父节点`5`交换位置以维持堆序属性。

```plaintext
Step 1:
       4
      / \
     5   8

Step 2 (Insert 2 and swap):
       4
      / \
     2   8
    /
   5
```

2. **调整堆**

   - `2`比其父节点`4`小，所以继续与父节点交换。

```plaintext
Final Min Heap:
       2
      / \
     4   8
    /
   5
```

现在我们有了一个最小堆，其中根节点`2`是最小的元素

✨ 对应的数据为 `heap = [2, 4, 8, 5]`

#### 添加新元素

如果我们要添加一个新的元素，比如`3`，我们会将它插入到数组末尾，然后根据需要进行上浮操作：

```plaintext
Before Insert:
       2
      / \
     4   8
    /
   5

After Insert (3):
       2
      / \
     4   8
    / \
   5   3

After Swap (if necessary):
       2
      / \
     3   8
    / \
   5   4
```

在这个例子中，`3`被插入后需要与父节点`4`交换位置，因为它更小

✨ 对应的数据为 `heap = [2, 3, 4, 8, 5]`

#### 提取最小元素

当我们从最小堆中提取最小元素时，我们将根节点移除，并将最后一个元素移到根的位置，然后通过下沉操作恢复堆序属性。

```plaintext
Extract Min:
Remove 2, replace with 4:

       4
      / \
     3   8
    /
   5

Sink Down:
       3
      / \
     4   8
    /
   5
```

✨ 对应的数据为 `heap = [3, 4, 8, 5]`

👇 正因为使用了一维数组做堆的数据结构，因此当需要 **按图形的节点概念** 来操作堆时需要知道如何计算子节点和父节点的索引

对于一个基于0索引的数组表示的最小堆：

- 父节点 `i` 的左子节点位于索引 `2 * i + 1`
- 父节点 `i` 的右子节点位于索引 `2 * i + 2`
- 子节点 `i` 的父节点位于索引 `Math.floor((i - 1) / 2)`

#### leetcode

回到题目 [703. 数据流中的第 K 大元素- leetcode](https://leetcode.cn/problems/kth-largest-element-in-a-stream/description/)

> 找到数据流中第 k 大元素

1. 初始化时，我们将所有初始元素加入到最小堆中，但只保留最大的k个元素。
2. 每当我们调用`add`方法时，我们将新值插入到最小堆中，并确保堆大小不超过k。如果超过，则移除堆顶元素（即最小的元素）。
3. `add`方法返回最小堆的顶部元素，它代表当前数据流中的第k大元素。

为了高效地找到第k大的元素，我们需要一种能够在添加新元素时快速更新和查询的数据结构

**堆** 是一种非常适合这种场景的数据结构，因为它可以在 `O(log n)` 的时间复杂度内插入或删除元素，并且可以在 `O(1)` 的时间复杂度内访问最小或最大元素（取决于我们使用的是最小堆还是最大堆）

```js
// 插入元素到最小堆并维持堆性质
function insert(heap, value) {
  heap.push(value);
  let i = heap.length - 1;
  while (i > 0) {
    let parentIndex = Math.floor((i - 1) / 2);
    if (heap[parentIndex] <= heap[i]) break;
    [heap[parentIndex], heap[i]] = [heap[i], heap[parentIndex]];
    i = parentIndex;
  }
}

// 移除堆顶元素并维持堆性质
function extractMin(heap) {
  if (heap.length === 0) return;
  const min = heap[0];
  const last = heap.pop();
  if (heap.length > 0) {
    heap[0] = last;
    sinkDown(heap, 0);
  }
  return min;
}

// 下沉堆顶元素以维持堆性质
function sinkDown(heap, index) {
  let length = heap.length;
  let element = heap[index];

  while (true) {
    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;
    let swap = null;

    if (leftChildIndex < length && heap[leftChildIndex] < element) {
      swap = leftChildIndex;
    }

    if (
      rightChildIndex < length &&
      ((swap === null && heap[rightChildIndex] < element) ||
        (swap !== null && heap[rightChildIndex] < heap[swap]))
    ) {
      swap = rightChildIndex;
    }

    if (swap === null) break;
    heap[index] = heap[swap];
    heap[swap] = element;
    index = swap;
  }
}

// 创建KthLargest处理函数，并返回add方法
function createKthLargest(k, nums) {
  // 初始化最小堆
  const minHeap = [];

  // 初始化最小堆
  nums.forEach((num) => {
    insert(minHeap, num);
    if (minHeap.length > k) extractMin(minHeap);
  });

  // 返回一个包含 add 方法的新函数
  return function add(val) {
    insert(minHeap, val);
    if (minHeap.length > k) extractMin(minHeap);
    return minHeap.length === k ? minHeap[0] : null;
  };
}

// 示例测试
const add = createKthLargest(3, [4, 5, 8, 2]);
console.log(add(3)); // 返回 4
console.log(add(5)); // 返回 5
console.log(add(10)); // 返回 5
console.log(add(9)); // 返回 8
console.log(add(4)); // 返回 8
```

这个解决方案的时间复杂度主要由插入和删除操作决定，对于每个操作都是O(log k)，其中k是我们需要维护的最小堆的大小。初始化时，我们可能需要对n个元素进行这样的操作，因此初始化的时间复杂度为O(n log k)。空间复杂度为O(k)，因为我们只需要存储k个元素在最小堆中。

### React 任务调度

在 `React 16` 引入的Fiber架构之后。Fiber使得React能够中断渲染过程并在必要时恢复，从而提高了交互性能

为了支持这种能力，React需要一种机制来确定哪些更新最重要，应该优先处理

> 任务调度: 根据任务的优先级或其他条件来决定哪个任务应该最先被执行

✨ 使用最小堆来实现任务调度

👇 `任务调度` 和 `leetcode` 算法题不一样的是:

1. 只关注顶层节点，不关注k(指定参数)
2. 每次处理后都会移除顶节点，即: 触发最小堆的 `extractMin()`
