
<script setup lang="ts">

const props = defineProps<{
  hot?: number
  category?: string
  tags?: string[]
  time?: string
  vertical?: boolean
}>()



const hotText= computed(()=>{
  if(props.hot === undefined) return '无'
  if(props.hot == 0) return '无'
  if(props.hot < 100) return '<100'
  if(props.hot < 1000) return '<1000'
  if(props.hot < 5000) return '<5000'
  return '>5000'
})
</script>


<template>
  <div
    :class="['grid gap-2 justify-center items-center w-full rounded max-w-[500px]', vertical ? 'grid-cols-2' : 'grid-cols-4']"
  >
    <div v-if="hot !== undefined" class="typography-muted flex justify-start items-center gap-2">
      <span class="i-solar-fire-bold-duotone h-4 w-4 text-amber-500" />热度
    </div>
    <div v-if="hot !== undefined" :class="['typography-small opacity-80', vertical && 'text-right']">
      {{ hotText }}
    </div>
    <div class="typography-muted flex justify-start items-center gap-2">
      <span class="i-solar-copy-bold-duotone h-4 w-4 text-sky-500" />
      <span class="">分类</span>
    </div>
    <div :class="['typography-small opacity-80', vertical && 'text-right', hot === undefined && 'col-span-3']">
      {{ category }}
    </div>
    <div v-if="time" class="typography-muted flex justify-start items-center gap-2">
      <span class="i-solar-calendar-mark-bold-duotone h-4 w-4 text-red-500" />创建时间
    </div>
    <div v-if="time" :class="['typography-small opacity-80', vertical ? 'text-right' : 'col-span-3']">
      {{ time }}
    </div>
    <div class="typography-muted flex justify-start items-center gap-2">
      <span class="i-solar-bookmark-circle-bold-duotone h-4 w-4 text-green-500" /> 标签
    </div>
    <div :class="['typography-small opacity-80', vertical ? 'text-right' : 'col-span-3']">
      {{
        tags?.join(', ')
      }}
    </div>
  </div>
</template>
