<script setup lang="ts">
import Delete from '~/components/user/form/resource/delete.vue'
import Document from '~/components/user/form/resource/document.vue'
import Edit from '~/components/user/form/resource/edit.vue'


const route = useRoute()

const names = computed(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id
  }
  return [route.params.id]
})

// 国际化
const { t } = useI18n()
// 选中的数据
const selected = ref<ResourceInfo[]>([])
// 搜索
const query = ref('')

const { history } = useThrottledRefHistory(query, {
  throttle: 2000,
  deep: true,
  trailing: true
})

const pageIndex = ref(1)
const pageSize = ref(10)

// 模态框组件
const modal = useModal()
// 提示组件
const toast = useToastHandle()

const { data, refresh, pending, error } = useAsyncData(
  () => resourceApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot,
    ShopName: names.value.at(-1) ?? ''
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<ResourceInfo> => ({
    Rows: [],
    Total: 0
  }),
})
onMounted(() => {
  data.value.Rows = []
})

const links = [{
  label: '我的店铺',
  icon: 'i-heroicons-home',
  to: '/user/resource/store'
}, ...names.value.map((name, index) => ({
  label: name,
  to: '/user/resource/store/' + names.value.slice(0, index + 1).join('/')
}))]



// 删除
const onDelete = async (row: ResourceInfo) => {
  try {
    await resourceApi.delete(row)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}

// 修改上架下架
const onPublic = async (row: ResourceInfo) => {
  try {
    await resourceApi.update({
      ResourceID: row.ID,
      IsEnable: !row.IsEnable
    })
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}


// 修改文档
const onDocument = (row: ResourceInfo) => {
  modal.open(Document, {
    row,
    onSuccess: async (data) => {
      try {
        await resourceApi.update({
          ResourceID: row.ID,
          Document: data.Document,
        })
        await refresh()
      } catch (e: any) {
        toast.error(e.message)
      }
    }
  })
}


// 修改
const onUpdate = (row: ResourceInfo) => {
  modal.open(Edit, {
    row,
    onSuccess: async (data) => {
      try {
        await resourceApi.update({
          ResourceID: row.ID,
          ...data,
        })
        await refresh()
      } catch (e: any) {
        toast.error(e.message)
      }
    }
  })
}



// 列表操作菜单
function menus(row: ResourceInfo) {
  return [
    [
      {
        label: '编辑',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => onUpdate(row)
      },
      //  {
      //   label: row.IsEnable ? '下架' : '上架',
      //   icon: row.IsEnable ? 'i-solar-archive-down-bold-duotone' : 'i-solar-archive-up-bold-duotone',
      //   show: true,
      //   click: () => onPublic(row)
      // },
      {
        label: '修改文档',
        icon: 'i-heroicons-document-text-20-solid',
        click: () => onDocument(row)
      },
    ], [
      {
        label: '下载',
        icon: 'i-heroicons-arrow-down-circle-20-solid',
        click: () => {
          window.open(row.DownloadUrl)
        }
      },
      {
        label: '删除',
        icon: 'i-heroicons-trash-20-solid',
        click: () => {
          modal.open(Delete, {
            row,
            onDelete
          })
        }
      }
    ]
  ]
}


// 列表键
const columns: {
  key: keyof ResourceInfo
  label?: string
}[] = [{
  key: 'Ico',
  label: '图标'
}, {
  key: 'Name',
  label: '资源名称',
}, {
  key: 'Download',
  label: '热度',
}, {
  key: 'ClassName',
  label: '分类',
}, {
  key: 'Tags',
  label: '标签',
},
//  {
//   key: 'IsEnable',
//   label: '状态',
// },
{
  key: 'Description',
  label: '描述'
}, {
  key: 'Createtime',
  label: '创建时间',
}]


</script>

<template>
  <UDashboardNavbar :title="names.at(-1)" :badge="data.Total" class=" border-0">
    <template #right>
      <NuxtLink href="/user/data/bucket">
        <UButton label="添加资源" trailing-icon="i-heroicons-plus" color="gray" />
      </NuxtLink>
    </template>
  </UDashboardNavbar>
  <div class="px-4 pb-6">
    <UBreadcrumb :links="links" />
  </div>

  <TableBase
    $query="query"
    $page-index="pageIndex"
    $page-size="pageSize"
    :error="error"
    :loading="pending"
    :list="(data.Rows??[])"
    :page-total="data.Total"
    :columns="columns"
    :menus="menus"
    :refresh="refresh"
  >
    <template #Ico-data="{ row }">
      <BrandLogo :src="(row.Ico)" class="!w-[100px] !h-[100px]" />
    </template>
    <template #Name-data="{ row }">
      <UTooltip :text="row.Name" :popper="{ arrow: true }">
        <div class="truncate w-[100px]">
          {{ row.Name }}
        </div>
      </UTooltip>
    </template>
    <template #Description-data="{ row }">
      <div class=" w-[200px]">
        {{ row.Description }}
      </div>
    </template>
    <template #Tags-data="{ row }">
      <UBadge v-for="(tag, index) in row.Tags" :key="index" :label="tag" class="max-w-[200px] m-1" variant="soft" />
    </template>
    <template #Createtime-data="{ row }">
      {{ format.dateTime((row.Createtime)) }}
    </template>
    <template #IsEnable-data="{ row }">
      {{ row.IsEnable ? '上架' : '下架' }}
    </template>
  </TableBase>
</template>
