<template>
  <div class="grid gap-2 list mt-4">
    <div
      v-for="item in list"
      class="test p-l-4 min-h-20 b-solid b-transparent hover:b-indigo b-rd-2 b-1"
    >
      <h3 class="color-indigo">{{item.title}}</h3>
      <ul v-if="item.childs && item.childs.length > 0">
        <li
          v-for="pageItem in item.childs"
          class="hover:color-blue cursor-pointer"
          @click="jump(pageItem)"
        >{{ pageItem.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'uno.css'

interface Item {
  title: string
  childs?: Item[]
}

defineProps<{
  list: Item[]
}>()

const jump = (item: Item) => {
  console.log('跳转', item.title)
}
</script>

<style>
.list {
  grid-template-columns: 0.5fr 0.5fr;
}
.test {
  background-color: var(--vp-c-bg-soft);
}
</style>