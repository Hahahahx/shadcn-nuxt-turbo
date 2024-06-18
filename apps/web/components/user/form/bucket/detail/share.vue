<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import type { CreateDirParams, FileInfo } from '~/api/bucket'

const schema = z.object({
  Expire: z.string({
    required_error: '期限不可以为空'
  })
})

const model = defineModel({
  type: Boolean
})


const items = [
  {
    label: '1天',
    value: 1,
  },
  {
    label: '3天',
    value: 3,
  },
  {
    label: '7天',
    value: 7,
  },
  {
    label: '永久',
    value: 0,
  },
]


const state = reactive({
  Expire: undefined,
  IsEncrypt:false,
  ShareFilePassword:undefined
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onShare, row } = defineProps<{
  row: FileInfo
  onShare: (item: ShareCreate) => Promise<void>
}>()


async function onSubmit(event: FormSubmitEvent<ShareCreate>) {
  loading.value = true
  event.data.Path = row.Name
  await onShare(event.data)
  loading.value = false
  model.value = false
}

</script>

<template>
  <UDashboardModal v-model="model" title="分享文件" description="创建一个分享链接共享该文件" :ui="{ width: 'sm:max-w-md' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="分享期限" name="Expire">
        <USelect
          v-model="state.Expire"
          :options="items"
          placeholder="请选择分享期限"
          value-attribute="value"
          option-attribute="label"
          :ui-menu="{
            base: 'z-[1000]'
          }"
        />
      </UFormGroup>


      <UFormGroup name="IsEncrypt">
        <UCheckbox v-model="state.IsEncrypt" color="primary" label="是否加密" />
      </UFormGroup>
      <UFormGroup v-if="state.IsEncrypt" name="ShareFilePassword">
        <UInput v-model="state.ShareFilePassword" placeholder="请输入密码" />
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
