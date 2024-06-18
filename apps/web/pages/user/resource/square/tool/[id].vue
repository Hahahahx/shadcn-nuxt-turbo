<script setup lang="ts">
// @ts-ignore
import Markdown from 'vue3-markdown-it'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'




const { params } = useRoute()


const { data, } = useAsyncData(
  () => resourceApi.detail({
    ID: params.id as string,
  }))

const onBack = () => {
  navigateTo('/user/resource/square/search')
}

const onDownload = (url?:string) => url && window.open(url, '_blank')
</script>


<template>
  <div class="container mx-auto  py-6 flex justify-between items-center">
    <UButton variant="soft" class="ml-6" @click="onBack">
      返回上级
    </UButton>
  </div>
  <div class="container mx-auto flex h-screen ">
    <div class="flex flex-col p-4 flex-1 gap-4">
      <Card class="flex items-center" :class="['!shadow-none', '!border-0']">
        <CardHeader>
          <div class="h-[90px]">
            <AspectRatio :ratio="9 / 9" class="rounded-none h-full flex justify-center ">
              <img :src="data?.Ico" alt="Image" class="rounded-md object-cover w-[90px] h-[90px]">
            </AspectRatio>
          </div>
        </CardHeader>
        <CardContent class="flex flex-col gap-2 justify-center pt-6 flex-1">
          <CardTitle class="truncate text-lg">
            {{ data?.Name }}
          </CardTitle>
          <CardDescription>{{ data?.Description }}</CardDescription>

          <div class="grid grid-cols-4 gap-2 justify-center items-center w-full rounded max-w-[500px]">
            <div class="typography-muted">
              热度
            </div>
            <div class="col-span-3">
              {{ data?.Download }}
            </div>
            <div class="typography-muted">
              分类
            </div>
            <div class="col-span-3">
              {{ data?.ClassName }}
            </div>
            <div class="typography-muted col-span-1">
              标签
            </div>
            <div class="col-span-3">
              <UBadge v-for="(item, index) in data?.Tags" :key="index" color="gray" variant="solid" class="mx-1 my-1">
                {{ item }}
              </UBadge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <UButton @click="onDownload(data?.DownloadUrl)">
            下载
          </UButton>
        </CardFooter>
      </Card>

      <UDivider class="my-4" />

      <div class="flex-1 prose dark:prose-invert">
        <Markdown :source="data?.Document" />
      </div>
    </div>

    <!-- <div class="p-4 w-[300px]">
      <UCard>
        <template #header>
          内容
        </template>

<div>
  标签：十三点，阿达，地方， 地方， 地方，啥的
</div>
<div>
  分类：算力
</div>
<div>
  发布时间：2023-12-12 12:00:12
</div>
<template #footer>
          <div class="flex justify-end">
            <UButton>下载</UButton>
          </div>
        </template>
</UCard>
</div> -->
  </div>
</template>
