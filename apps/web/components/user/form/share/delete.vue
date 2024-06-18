<script setup lang="ts">
// 定义双向绑定模态框的显示
const model = defineModel({
  type: Boolean
})

// 定义外部数据，以及操作方法
const { row, onDelete } = defineProps<{
  row: ShareInfo
  onDelete: (row: ShareInfo) => Promise<void>
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
    :title="`${$t('user.share.table.action.cancle')}:${row.Id}`"
    :description="$t('user.share.modal.delete.desc')"
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
      <UButton color="red" :label="$t('user.share.cancle')" :loading="loading" @click="onSubmit" />
      <UButton color="white" :label="$t('modal.cancel')" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
