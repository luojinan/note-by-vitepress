
let activeEffect = null // <-- ✨ 临时变量 存需要记录的副作用函数(使用响应式数据方)
const createEffect = (fn) => {
  activeEffect = fn
  fn()
}

// ✨ 追踪 创建响应式数据和副作用函数的对应关系数据结构
const track = (target, key) => {
  let depsMap = bucket.get(target)
  if(!depsMap) {
    bucket.set(target, (depsMap = new Map())) // <-- ✨ 初始化数据结构 同时赋值
  }

  let depsFns = depsMap.get(key)
  if(!depsFns) {
    depsMap.set(key, (depsFns = new Set()))
  }

  depsFns.add(activeEffect) // 写死使用data数据的是 activeEffect 变量
}

// ✨ 触发 找到变动数据对应的副作用函数并执行
const trigger = (target, key) => {
  const depsMap = bucket.get(target)
  const depsFns = depsMap.get(key)
  depsFns.forEach(fn => fn()) // 全部执行
}

const bucket = new WeakMap()
const ref = (data) => {
  return new Proxy(data, {
    get(target, key) {
      track(target, key) // ✨ 追踪 创建响应式数据和副作用函数的对应关系数据结构
      return target[key]
    },

    set(target, key, newVal) {
      target[key] = newVal
      trigger(target, key) // ✨ 触发 找到变动数据对应的副作用函数并执行

      return true
    }
  })
}

const data = { text: 'hello world' }
const refData = ref(data)
function effect() {
  const res = refData.text
  console.log(res) // 一般为副作用函数，操作dom，或其他共享状态
}

createEffect(effect) // <-- ✨ 记录副作用函数(使用响应式数据方) 避免写死使用方函数名
setTimeout(() => {
  refData.text = 'hello vue3'
}, 1000);