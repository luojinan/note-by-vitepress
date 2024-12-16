<template>
  <div class="grid grid-cols-2 gap-2 list mt-4">
    <div
      v-for="item in list"
      class="test p-l-4 min-h-20 b-solid b-transparent hover:b-indigo b-rd-2 b-1"
    >
      <h3 class="color-indigo">{{item.title}}</h3>
      <ul v-if="item.childs && item.childs.length > 0">
        <li
          v-for="pageItem in item.childs"
          class="hover:color-indigo hover:underline cursor-pointer"
          @click="jump(pageItem)"
        >{{pageItem.emoji}} {{ pageItem.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'uno.css'
import { useRouter } from 'vitepress'

interface Item {
  title: string
  path?: string
  emoji?:string
  childs?: Item[]
}

defineProps<{
  list: Item[]
}>()

const router = useRouter()
const jump = (item: Item) => {
  router.go(`./${item.path}`)
}
</script>

<style>
.test {
  background-color: var(--vp-c-bg-soft);
}
@media (min-width: 375px) and (max-width: 768px) {
  .list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>