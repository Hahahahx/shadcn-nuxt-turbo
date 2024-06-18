<script setup lang="ts">
const model = defineModel({
  type: Boolean
})

const { row, onDelete } = defineProps<{
  row: RecycledInfo
  onDelete: (row: RecycledInfo) => Promise<void>
}>()

const loading = ref(false)

async function onDeleteHandle() {
  loading.value = true
  model.value = false
  await onDelete(row)
  loading.value = false
}
</script>

<template>
  <UDashboardModal
    v-model="model"
    :title="$t('user.bucket.recycle.modal.delete.title')"
    :description="$t('user.bucket.recycle.modal.delete.desc')"
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
      <UButton color="red" :label="$t('modal.delete')" :loading="loading" @click="onDeleteHandle" />
      <UButton color="white" :label="$t('modal.cancel')" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
