<script setup lang="ts">
const model = defineModel({
  type: Boolean
})


// 定义外部传入的操作
const { row } = defineProps<{
  row: ResourceInfo
  // onSuccess: (item: ResourceCreate) => Promise<void>
}>()



</script>

<template>
  <UDashboardModal v-model="model" title="编辑文档" description="修改您的文档信息" :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <div class="flex-1 prose dark:prose-invert">
      {{ row.Document }}
      <Markdown :source="`row.Document`" />
    </div>
  </UDashboardModal>
</template>
