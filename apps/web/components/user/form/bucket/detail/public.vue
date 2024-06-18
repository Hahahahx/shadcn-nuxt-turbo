<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import type { FileInfo } from '~/api/bucket'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '~/components/ui/tags-input'


// @ts-ignore
import VMdEditor from '@kangc/v-md-editor'

const schema = z.object({
  // Image: z.any().refine(val => !!val, '请上传资源Logo'),
  Name: z.string({
    required_error: '名称不可以为空'
  }),
  Description: z.string({
    required_error: '概述不可以为空'
  }),
  IsPublic: z.boolean(),
  Category: z.string({
    required_error: '分类不可以为空'
  }),
})

const model = defineModel({
  type: Boolean
})


const state = reactive({
  Image: undefined,
  Name: undefined,
  Description: undefined,
  IsPublic: false,
  Category: undefined,
  Tags: [],
  Document: undefined,
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onPublic, row } = defineProps<{
  row: FileInfo
  onPublic: (item: ResourceCreate) => Promise<void>
}>()


async function onSubmit(event: FormSubmitEvent<ResourceCreate>) {
  loading.value = true
  await onPublic(event.data)
  loading.value = false
  model.value = false
}

const getFileObject = (e: any) => {
  state.Image = e.target.files[0]
}
</script>

<template>
  <UDashboardModal v-model="model" title="发布资源" description="将文件公开发布到社区资源广场中" :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="资源图片" name="Image">
        <input
          class="relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 file:cursor-pointer file:rounded-l-md file:absolute file:left-0 file:inset-y-0 file:font-medium file:m-0 file:border-0 file:ring-1 file:ring-gray-300 dark:file:ring-gray-700 file:text-gray-900 dark:file:text-white file:bg-gray-50 hover:file:bg-gray-100 dark:file:bg-gray-800 dark:hover:file:bg-gray-700/50 ps-[96px] text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          type="file"
          accept="image/*"
          @change="getFileObject"
        >
      </UFormGroup>
      <UFormGroup label="名称" name="Name">
        <UInput v-model="state.Name" placeholder="请输入名称" />
      </UFormGroup>

      <UFormGroup label="概述" name="Description">
        <UTextarea v-model="state.Description" color="primary" variant="outline" placeholder="请输入概述..." />
      </UFormGroup>

      <UFormGroup name="IsPublic">
        <div class="flex items-center gap-2">
          <UCheckbox v-model="state.IsPublic" color="primary" label="是否公开" />
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
      <UFormGroup label="分类" name="Category">
        <USelectMenu
          v-model="state.Category"
          size="md"
          placeholder="请选择分类..."
          :options="['Any', 'K', 'L1', 'L2', 'L3']"
        />
      </UFormGroup>
      <UFormGroup label="标签" name="Tags">
        <TagsInput v-model="state.Tags">
          <TagsInputItem v-for="item in state.Tags" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="请输入标签..." />
        </TagsInput>
      </UFormGroup>

      <UFormGroup label="简介文档(Markdown)" name="Document">
        <div class="light">
          <v-md-editor height="400px" class=" light " />
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
