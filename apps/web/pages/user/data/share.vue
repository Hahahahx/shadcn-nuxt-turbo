<script setup lang="ts">
import Delete from '~/components/user/form/share/delete.vue'


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
  'shareApi.list', () => shareApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<ShareInfo> => ({
    Rows: [],
    Total: 0
  }),

})


// 删除
const onDelete = async (row: ShareInfo) => {
  try {
    await shareApi.delete(row)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}


// 列表操作菜单
function menus(row: ShareInfo) {
  return [
    [{
      label: '复制链接',
      icon: 'i-heroicons-document-text-20-solid',
      show: true,
      click: () => {
        navigator.clipboard.writeText(row.ShareUrl)
      }
    }, {
      label: '取消分享',
      icon: 'i-heroicons-trash-20-solid',
      click: () => {
        modal.open(Delete, {
          row,
          onDelete
        })
      }
    }],
  ]
}


// 列表键
const columns: {
  key: keyof ShareInfo
  label?: string
}[] = [{
  key: 'Name',
  label: '文件名称',
}, {
  key: 'Status',
  label: '状态'
}, {
  key: 'ExploreTime',
  label: '过期时间',
}]


</script>

<template>
  <UDashboardNavbar title="分享列表" :badge="data.Total" class=" border-0">
    <template #right>
      <NuxtLink href="/user/data/bucket">
        <UButton label="添加分享" trailing-icon="i-heroicons-plus" color="gray" />
      </NuxtLink>
    </template>
  </UDashboardNavbar>
  <TableBase
    $query="query"
    $page-index="pageIndex"
    $page-size="pageSize"
    :error="error"
    :loading="pending"
    :list="data.Rows ?? []"
    :page-total="data.Total"
    :columns="columns"
    :menus="menus"
    :refresh="refresh"
  >
    <template #ExploreTime-data="{ row }">
      {{ format.dateTime((row.ExploreTime)) }}
    </template>
    <template #Status-data="{ row }">
      {{ row.Status === 1 ? '有效' : '已失效' }}
    </template>
  </TableBase>
</template>
