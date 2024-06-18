<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import { TagsCombobox } from '~/components/ui/tags-input'

const schema = z.object({
  Ico: z.any().refine(val => !!val, '请上传资源Logo'),
  // Background: z.any().refine(val => !!val, '请上传资源背景图片'),
  ShopName: z.string({
    required_error: '名称不可以为空'
  }),
  Mark: z.string({
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


const state = reactive<Partial<StoreCreate>>({
  Ico: undefined,
  ShopName: undefined,
  Background: undefined,
  ClassID: undefined,
  Tags: [],
  Mark: undefined
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onSuccess } = defineProps<{
  onSuccess: (item: StoreCreate) => Promise<void>
}>()


async function onSubmit(event: FormSubmitEvent<StoreCreate>) {
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
  <UButton label="添加店铺" trailing-icon="i-heroicons-plus" color="gray" @click="model = true" />
  <UDashboardModal v-model="model" title="创建店铺" description="创建个人店铺，将资源发布到店铺中 " :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Logo" name="Ico">
        <UploadInput v-model="state.Ico" />
      </UFormGroup>
      <UFormGroup label="背景图片" name="Background">
        <UploadInput v-model="state.Background" />
      </UFormGroup>
      <UFormGroup label="名称" name="ShopName">
        <UInput v-model="state.ShopName" placeholder="请输入名称" />
      </UFormGroup>
      <UFormGroup label="概述" name="Mark">
        <UTextarea v-model="state.Mark" color="primary" variant="outline" placeholder="请输入概述..." />
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
