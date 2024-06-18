<script setup lang="ts">
const { path } = defineProps<{
  path: string
}>()
// 定义双向绑定模态框的显示
const model = defineModel({
  type: Boolean,
})
const filePath = ref(path)

effect(() => {
  filePath.value = path
})

const { data, refresh, pending, error } = useAsyncData(
  'bucketApi.detail.info',
  () => bucketApi.detail.info(filePath.value),
  {
    watch: [filePath],
    default: (): FileinfoData => ({
      ChunkList: {
        Chunks: [],
        Total: 0,
      },
      Ctime: 0,
      Mtime: 0,
      Name: '',
      Path: '',
      Size: 0,
      Type: '',
    }),
  })

const columns: {
  key: keyof FileinfoDataChunkInfo
  label?: string
  sortable?: boolean
}[] = [{
  key: 'ChunkID',
  label: '分块名称',
  sortable: true,
}, {
  key: 'ChunkSize',
  label: '分块大小',
  class: ' truncate',
  sortable: true,
}, {
  key: 'InternalURL',
  label: '存储地址',
  sortable: true,
}, {
  key: 'ServerTags',
  label: '服务器',
  sortable: true,
}, {
  key: 'DataCenterTags',
  label: '数据中心',
  sortable: true,
}, {
  key: 'Mtime',
}]

const query = ref('')
const pageIndex = ref(1)
const pageSize = ref(10)

// 分页
const list = computed(() => {
  return data.value.ChunkList?.Chunks?.filter(i => i.ChunkID?.includes(query.value)).slice((pageIndex.value - 1) * pageSize.value, pageIndex.value * pageSize.value) ?? []
})

const fileInfo = computed(() => ([
  {
    name: '文件名',
    value: data.value.Name,
  },
  {
    name: '文件大小',
    value: merticKB(data.value.Size ?? 0) as string,
  },
  {
    name: '路径',
    value: (data.value.Path),
  },
  {
    name: '后缀',
    value: (data.value.Type),
  },
  {
    name: '创建时间',
    value: format.dateTime(data.value.Ctime),
  },
  {
    name: '修改时间',
    value: format.dateTime(data.value.Mtime),
  },
]))

const { copy } = useClipboard()
</script>

<template>
  <UDashboardModal v-model="model" title="文件详情" description="查看文件具体内容信息" :ui="{ width: 'sm:max-w-2xl' }">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <div v-for="item in fileInfo" :key="item.name" class="grid w-full grid-cols-4 px-2">
        <div class="col-span-1 pl-2 border-l-2 typography-muted border-gray-500/50">
          {{ item.name }}
        </div>
        <div
          class="w-full col-span-3 truncate cursor-pointer typography-muted"
          :title="`点击复制：${item.value}`"
          @click="copy(item.value!)"
        >
          {{ item.value }}
        </div>
      </div>
    </div>
    <TableBase
      $selected="selected"
      $query="query"
      $page-index="pageIndex"
      $page-size="pageSize"
      :loading="pending"
      :error="error"
      :list="list"
      :page-total="data.ChunkList?.Total ?? 0"
      :columns="columns"
      :refresh="refresh"
    >
      <template #ChunkSize-data="{ row }">
        <SizeBadge :size="row.ChunkSize ?? 0" />
      </template>
      <template #InternalURL-data="{ row }">
        <p v-for="i in row.InternalURL" :key="i">
          {{ i }}
        </p>
      </template>
      <template #ServerTags-data="{ row }">
        <p v-for="i in row.ServerTags" :key="i">
          {{ i }}
        </p>
      </template>
      <template #DataCenterTags-data="{ row }">
        <p v-for="i in row.DataCenterTags" :key="i">
          {{ i }}
        </p>
      </template>
    </TableBase>
  </UDashboardModal>
</template>
