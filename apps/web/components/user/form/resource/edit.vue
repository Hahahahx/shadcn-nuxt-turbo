<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import { TagsCombobox } from '~/components/ui/tags-input'


const schema = z.object({
  // Image: z.any().refine(val => !!val, '请上传资源Logo'),
  Name: z.string({
    required_error: '名称不可以为空'
  }),
  Description: z.string({
    required_error: '概述不可以为空'
  }),
  ClassID: z.string({
    required_error: '分类不可以为空'
  }),
  Tags:z.array(z.string(),{
    required_error:'标签不可以为空'
  }).refine(res=>res.length,{
    message:'标签不可以为空，输入后请回车确保标签存在'
  })
})

const model = defineModel({
  type: Boolean
})


const state = reactive<Partial<ResourceCreate>>({
  Ico: undefined,
  Name: undefined,
  Description: undefined,
  ClassID: undefined,
  Tags: [],
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { row, onSuccess } = defineProps<{
  row: ResourceInfo
  onSuccess: (item: ResourceCreate) => Promise<void>
}>()


effect(() => {
  state.Name = row.Name
  state.Description = row.Description
  state.ClassID = row.ClassID
  state.Tags = row.Tags
})


async function onSubmit(event: FormSubmitEvent<ResourceCreate>) {
  loading.value = true
  await onSuccess(event.data)
  loading.value = false
  model.value = false
}

const { data, pending } = useAsyncData('commonApi.categorys', commonApi.categorys, {
  default: (): CategoryInfo => ({
    Class:[],
    Tags:[]
  })
})


</script>

<template>
  <UDashboardModal v-model="model" title="修改资源" description="修改资源在广场中的展示信息" :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="资源图片" name="Ico">
        <UploadInput v-model="state.Ico" />
      </UFormGroup>
      <UFormGroup label="名称" name="Name">
        <UInput v-model="state.Name" placeholder="请输入名称" />
      </UFormGroup>

      <UFormGroup label="概述" name="Description">
        <UTextarea v-model="state.Description" color="primary" variant="outline" placeholder="请输入概述..." />
      </UFormGroup>

      <UFormGroup name="IsEnable">
        <div class="flex items-center gap-2">
          <UCheckbox v-model="state.IsEnable" color="primary" label="是否公开" />
          <UPopover mode="hover" :popper="{ placement: 'right' }">
            <UIcon name="i-heroicons-information-circle-20-solid" color="red" />
            <template #panel>
              <div class="max-w-[200px] text-sm p-2">
                该操作代表您允许将资源公开在资源广场中，他人可以直接访问并下载到该资源，
                请谨慎操作。
              </div>
            </template>
          </UPopover>
        </div>
      </UFormGroup>
      <UFormGroup label="分类" name="ClassID">
        <USelectMenu
          v-model="state.ClassID"
          size="md"
          placeholder="请选择分类..."
          option-attribute="Name"
          value-attribute="ID"
          :options="data.Class"
          :loading="pending"
        />
      </UFormGroup>
      <UFormGroup label="标签" name="Tags">
        <TagsCombobox
          v-model="state.Tags"
          class="w-full"
          placeholder="请输入标签..."
          :options="data.Tags.map(item=>({
            label:item.Name,
            value:item.ID
          }))"
        />
      </UFormGroup>
      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" :loading="loading" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
