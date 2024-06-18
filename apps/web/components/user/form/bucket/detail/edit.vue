<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import type { FileEditParams, FileInfo } from '~/api/bucket'

const schema = z.object({
  NewFileName: z.string({
    required_error: '文件名称不可以为空'
  }),
})

const model = defineModel({
  type: Boolean
})

// 定义加载状态
const loading = ref(false)


// 定义外部数据，以及操作方法
const { row, onEdit } = defineProps<{
  row: FileInfo
  onEdit: (item: FileEditParams) => Promise<void>
}>()

const state = reactive<FileEditParams>({
  NewFileName: '',
  OldFileName: ''
})

effect(() => {
  state.OldFileName = row.Name
  state.NewFileName = row.Name
})

async function onSubmit(event: FormSubmitEvent<FileEditParams>) {

  if (state.NewFileName === state.OldFileName) {
    model.value = false
    return
  }

  loading.value = true
  await onEdit(event.data)
  loading.value = false
  model.value = false
}

</script>

<template>
  <UDashboardModal v-model="model" title="修改文件名" description="修改当前的文件的命名" :ui="{ width: 'sm:max-w-md' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="名称" name="NewFileName">
        <UInput v-model="state.NewFileName" autofocus placeholder="请输入文件名称" />
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
