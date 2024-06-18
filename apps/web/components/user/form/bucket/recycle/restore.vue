<script setup lang="ts">
const model = defineModel({
  type: Boolean
})

const { row, onRestore } = defineProps<{
  row: RecycledInfo
  onRestore: (row: RecycledInfo) => Promise<void>
}>()

const loading = ref(false)

async function onRestoreHandle() {
  loading.value = true
  model.value = false
  await onRestore(row)
  loading.value = false
}
</script>

<template>
  <UDashboardModal
    v-model="model"
    :title="$t('user.bucket.recycle.modal.restore.title')"
    :description="$t('user.bucket.recycle.modal.restore.desc')"
    icon="i-heroicons-cube"
    prevent-close
    :close-button="null"
    :ui="{
      icon: {
        base: 'text-green-500 dark:text-green-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
    }"
  >
    <template #footer>
      <UButton color="green" :label="$t('user.bucket.recycle.modal.restore.action.ok')" :loading="loading" @click="onRestoreHandle" />
      <UButton color="white" :label="$t('modal.cancel')" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
