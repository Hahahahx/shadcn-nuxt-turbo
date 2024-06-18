<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'


// @ts-ignore
import VMdEditor from '@kangc/v-md-editor'

const schema = z.object({
})

const model = defineModel({
  type: Boolean
})


const state = reactive<Partial<ResourceCreate>>({
  Document: undefined,
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onSuccess, row } = defineProps<{
  row: ResourceInfo
  onSuccess: (item: ResourceCreate) => Promise<void>
}>()



effect(() => {
  state.Document = row.Document
})


async function onSubmit(event: FormSubmitEvent<ResourceCreate>) {
  loading.value = true
  await onSuccess(event.data)
  loading.value = false
  model.value = false
}


</script>

<template>
  <UDashboardModal v-model="model" title="编辑文档" description="修改您的文档信息" :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="简介文档(Markdown)" name="Document">
        <div class="light">
          <v-md-editor v-model="state.Document" height="400px" class=" light shadow-none" />
        </div>
        <!-- <UTextarea color="primary" variant="outline" placeholder="简介文档..." /> -->
      </UFormGroup>
      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
