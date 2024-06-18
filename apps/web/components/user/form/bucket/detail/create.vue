<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import type { CreateDirParams } from '~/api/bucket'

const schema = z.object({
  DirName: z.string({
    required_error: '目录名称不可以为空'
  }).min(1, '目录名称不可以为空'),
})

const model = defineModel({
  type: Boolean
})


const state = reactive({
  DirName: undefined,
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onCreate } = defineProps<{
  onCreate: (item: CreateDirParams) => Promise<void>
}>()


async function onSubmit(event: FormSubmitEvent<CreateDirParams>) {

  if(!event.data.DirName){
    loading.value = false
    model.value = false
    return
  }

  loading.value = true
  await onCreate(event.data)
  loading.value = false
  model.value = false
}

</script>

<template>
  <UButton label="新建目录" trailing-icon="i-heroicons-plus" color="gray" :loading="loading" @click="model = true" />
  <UDashboardModal v-model="model" title="新建目录" description="在当前路径下创建一个新的目录" :ui="{ width: 'sm:max-w-md' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="名称" name="DirName">
        <UInput v-model="state.DirName" autofocus placeholder="请输入文件名称" />
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
