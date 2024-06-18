<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import { TagsCombobox } from '~/components/ui/tags-input'
// @ts-ignore
import VMdEditor from '@kangc/v-md-editor'

const schema = z.object({
  // Ico: z.any().refine(val => !!val, '请上传资源Logo'),
  // Background: z.any().refine(val => !!val, '请上传资源图片'),
  Name: z.string({
    required_error: '名称不可以为空'
  }),
  Description: z.string({
    required_error: '概述不可以为空'
  }),
  ShopID: z.string({
    required_error: '店铺不可以为空'
  }),
  ClassID: z.string({
    required_error: '分类不可以为空'
  }),
  // Tags:z.array(z.string(),{
  //   required_error:'标签不可以为空'
  // }).refine(res=>res.length,{
  //   message:'标签不可以为空，输入后请回车确保标签存在'
  // })
})

const model = defineModel({
  type: Boolean
})


const state = reactive<Partial<ResourceCreate>>({
  Ico: undefined,
  Background:undefined,
  Name: undefined,
  Description: undefined,
  ClassID: undefined,
  Tags: [],
  Document: undefined,
  Path: undefined,
  BucketName: undefined,
  ShopID: undefined,
})
// 定义加载状态
const loading = ref(false)

// 定义外部传入的操作
const { onPublic } = defineProps<{
  onPublic: (item: ResourceCreate) => Promise<void>
}>()


async function onSubmit(event: FormSubmitEvent<ResourceCreate>) {
  loading.value = true
  await onPublic(event.data)
  loading.value = false
  model.value = false
}

const user = useUserStore()



const { data: stores, refresh: storeRefresh, pending: storeLoading } = useAsyncData(
  'storeApi.list', () => storeApi.list({
    Page: 0,
    PageSize: 100,
    DepId: user.userInfo.DepId,
  }), {
  default: (): Page.Response<StoreInfo> => ({
    Rows: [],
    Total: 0
  }),
})



const { data, pending } = useAsyncData('commonApi.categorys', commonApi.categorys, {
  default: (): CategoryInfo => ({
    Class:[],
    Tags:[]
  })
})


</script>

<template>
  <UDashboardModal v-model="model" title="发布资源" description="将文件公开发布到社区资源广场中" :ui="{ width: 'sm:max-w-4xl' }">
    <!-- ~/components/users/UsersForm.vue -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="资源Logo" name="Ico">
        <UploadInput v-model="state.Ico" />
      </UFormGroup>
      <UFormGroup label="资源图片" name="Background">
        <UploadInput v-model="state.Background" />
      </UFormGroup>
      <UFormGroup label="名称" name="Name">
        <UInput v-model="state.Name" placeholder="请输入名称" />
      </UFormGroup>

      <UFormGroup label="概述" name="Description">
        <UTextarea v-model="state.Description" color="primary" variant="outline" placeholder="请输入概述..." />
      </UFormGroup>

      <UFormGroup label="店铺" name="ShopID">
        <USelectMenu
          v-model="state.ShopID"
          size="md"
          placeholder="请选择店铺..."
          option-attribute="Name"
          value-attribute="ShopID"
          :options="stores.Rows"
          :loading="storeLoading"
        />
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

      <UFormGroup label="简介文档( Markdown )" name="Document">
        <div class="light">
          <v-md-editor v-model="state.Document" height="400px" class=" light " />
        </div>
        <!-- <UTextarea color="primary" variant="outline" placeholder="简介文档..." /> -->
      </UFormGroup>
      <div class="flex justify-end gap-3 pt-8">
        <UButton :label="$t('modal.cancel')" color="gray" variant="ghost" @click="model = false" />
        <UButton type="submit" :label="$t('modal.ok')" color="black" :loading="loading" />
      </div>
    </UForm>
  </UDashboardModal>
</template>
