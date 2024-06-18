<script setup lang="ts">
// 定义双向绑定模态框的显示
const model = defineModel({
  type: Boolean
})

// 定义外部数据，以及操作方法
const { row, onDelete } = defineProps<{
  row: AccessKeyInfo
  onDelete: (row: AccessKeyInfo) => Promise<void>
}>()

// 定义加载状态
const loading = ref(false)

// 提交事件
async function onSubmit() {
  loading.value = true
  model.value = false
  await onDelete(row)
  loading.value = false
}

</script>

<template>
  <UDashboardModal
    v-model="model"
    :title="`删除密钥${row.AccessKey}`"
    description="该操作会删除密钥键值对，请谨慎操作。"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
    }"
  >
    <template #footer>
      <UButton color="red" label="确认删除" :loading="loading" @click="onSubmit" />
      <UButton color="white" :label="$t('modal.cancel')" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
