<script setup lang="tsx">
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


const model = defineModel({
  type: Boolean
})


const selected = ref('公网网关')

const links = ref<{
  label: string
  value?: string
}[]>([{
  label: '首页',
  value: undefined,
}])


// 定义外部传入的操作
const { row } = defineProps<{
  row: ResourceInfo
}>()

const { data, pending, refresh } = useAsyncData(
  () => commonApi.resourceDetail({
    // () => resourceApi.detail({
    ID: row.ID,
    Path: links.value.at(-1)?.value,
    Fgw: selected.value
  }), {
  watch: [selected]
})

effect(() => {
  refresh()
})

const onDownload = (url?: string) => url && window.open(url, '_blank')


const fileIcon: { [k: string]: string } = {
  '.html': 'i-solar-code-2-bold-duotone',
  '.tsx': 'i-solar-code-2-bold-duotone',
}

const { data: filer } = useAsyncData(
  'filerApi.list',
  filerApi.list,
  {
    default: (): string[] => ([]),
    transform(res) {
      return ['公网网关', ...res.map(i => i.OSSAddress)]
    }
  })


const query = ref('')
const pageIndex = ref(1)
const pageSize = ref(10)

// 分页
const list = computed(() => {
  return data.value?.FileInfo.filter(i => i.Name?.includes(query.value)).slice((pageIndex.value - 1) * pageSize.value, pageIndex.value * pageSize.value) ?? []
})

function handleBreadcurmb(index: number) {
  links.value = [...links.value].slice(0, index + 1)
}

const columns: {
  key: keyof FileInfo
  label?: string
  sortable?: boolean
}[] = [{
  key: 'Name',
  label: '名称',
  sortable: true
}, {
  key: 'FileSize',
  label: '大小',
  // @ts-ignore
  class: ' truncate',
  sortable: true
}, {
  key: 'action' as any
}]

const onDetail = (row: FileInfo) => {
  if (row.Type === 'dir') {
    links.value.push({
      label: row.Name,
      value: row.Path
    })
  } else {
    resourceApi.download(row)
  }
}

const onCopy = (str?: string) => {
  str && navigator.clipboard.writeText(str)
}


</script>

<template>
  <UDashboardModal
    v-model="model"
    title="资源详情"
    description="查看资源详情以及简介文档"
    :ui="{ width: 'sm:max-w-4xl', height: 'h-fit' }"
  >
    <div v-if="pending">
      <div class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>

      <div class="space-y-2">
        <USkeleton class="h-8 w-full" />
        <USkeleton class="h-8 w-full" />
        <USkeleton class="h-8 w-full" />
        <USkeleton class="h-8 w-full" />
      </div>
    </div>


    <div v-else class="flex flex-col p-4 flex-1 gap-4">
      <UButtonGroup size="sm" orientation="horizontal" class="w-full">
        <USelectMenu v-model="selected" class="flex-1" :options="filer" />
      </UButtonGroup>
      <Card class="flex flex-col md:flex-row items-center" :class="['!shadow-none', '!border-0']">
        <CardHeader>
          <div class="h-[90px] flex justify-center items-center w-[90px]">
            <img v-if="data?.Ico" :src="data?.Ico" alt="Image" class="rounded-md object-cover w-full h-full">
            <img v-else src="/null.webp" alt="Image" class="rounded-md object-cover w-full h-full">
          </div>
        </CardHeader>
        <CardContent class="flex flex-col gap-2 justify-center pt-6 flex-1">
          <CardTitle class="truncate text-lg">
            {{ data?.Name }}
          </CardTitle>
          <CardDescription>{{ data?.Description }}</CardDescription>
          <UserSectionCardResourceFooter
            :hot="data?.Download"
            :category="data?.ClassName"
            :tags="data?.Tags"
            :time="format.dateTime(data?.Createtime)"
          />
        </CardContent>
        <CardFooter class="flex-col gap-4">
          <UButton block icon="i-heroicons-arrow-down-circle-20-solid" @click="onDownload(data?.DownloadUrl)">
            {{ data?.Type === "dir" ? "打包下载" : "下载" }}
          </UButton>
          <UButton
            block
            icon="i-heroicons-clipboard-document"
            color="gray"
            label="复制下载链接"
            @click="onCopy(data?.DownloadUrl)"
          />
        </CardFooter>
      </Card>
      <div v-if="data?.Type === 'dir'" class="px-4 ">
        <UBreadcrumb :links="links" custom>
          <template #icon="{ link, isActive, index }">
            <div :class="[!isActive && 'cursor-pointer']" @click=" !isActive && handleBreadcurmb(index)">
              {{ link.label }}
            </div>
          </template>
          <div />
        </UBreadcrumb>
      </div>
      <TableBase
        v-if="data?.Type === 'dir'"
        $query="query"
        $page-index="pageIndex"
        $page-size="pageSize"
        :loading="pending"
        :list="list"
        :page-total="data?.FileInfo.length || 0"
        :columns="columns"
        :refresh="refresh"
      >
        <template #Name-data="{ row }">
          <UButton
            variant="link"
            :color="row.Type === 'dir' ? 'amber' : 'gray'"
            :icon="row.Type === 'dir' ? 'i-solar-folder-bold-duotone' : fileIcon[row.Type ?? ''] ?? 'i-solar-document-bold-duotone'"
            @click="onDetail(row)"
          >
            {{ row.Name }}
          </UButton>
        </template>
        <template #FileSize-data="{ row }">
          <SizeBadge v-if="row.Type !== 'dir'" :size="row.FileSize ?? 0" />
          <div v-else />
        </template>
        <template #action-data="{ row }">
          <UButton variant="link" @click="onDownload(row.DownloadUrl)">
            下载
          </UButton>
          <UButton variant="link" class="ml-2" @click="onCopy(row.DownloadUrl)">
            复制
          </UButton>
        </template>
      </TableBase>
      <UDivider class="my-2" />

      <div class="flex-1 prose dark:prose-invert">
        <Markdown :source="data?.Document" />
      </div>
    </div>
  </UDashboardModal>
</template>
