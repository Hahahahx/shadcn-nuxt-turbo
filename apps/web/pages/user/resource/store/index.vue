<script setup lang="ts">
import Delete from '~/components/user/form/store/delete.vue'
import Edit from '~/components/user/form/store/edit.vue'



// 搜索
const query = ref('')
const pageIndex = ref(1)
const pageSize = ref(10)
const { history } = useThrottledRefHistory(query, {
  throttle: 2000,
  deep: true,
  trailing: true
})

// 模态框组件
const modal = useModal()
// 提示组件
const toast = useToastHandle()

const user = useUserStore()

const { data, refresh, pending, error } = useAsyncData(
  'storeApi.list', () => storeApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot,
    DepId: user.userInfo.DepId,
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<StoreInfo> => ({
    Rows: [],
    Total: 0
  }),

})


// 删除
const onDelete = async (row: StoreInfo) => {
  try {
    await storeApi.delete(row)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}



const onCreate = async (data: StoreCreate) => {
  try {
    await storeApi.create(data)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}




const onEdit = async (data: StoreCreate & {
  ShopID: string;
}) => {
  try {
    await storeApi.update(data)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}



// 列表操作菜单
function menus(row: StoreInfo) {
  return [
    [{
      label: '资源详情',
      icon: 'i-heroicons-arrow-right-circle-20-solid',
      to: `/user/resource/store/${row.Name}`,
      show: true
    }, {
      label: '店铺主页',
      icon: 'i-solar-clapperboard-bold-duotone',
      show: true,
      click: () => {
        navigateTo(`/store/${row.Name}`, {
          open: {
            target: '_blank'
          }
        })
      }
    }, {
      label: '编辑',
      icon: 'i-heroicons-pencil-square-20-solid',
      show: true,
      click: () => {
        modal.open(Edit, {
          row,
          onSuccess: async (data) => {
            await onEdit({ ...data, ShopID: row.ShopID })
          }
        })
      }
    }], [
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
    ],
  ]
}


// 列表键
const columns: {
  key: keyof StoreInfo
  label?: string
}[] = [{
  key: 'Ico',
  label: 'Logo'
}, {
  key: 'Background',
  label: '背景图片'
}, {
  key: 'Name',
  label: '名称',
}, {
  key: 'ClassName',
  label: '分类',
}, {
  key: 'Tags',
  label: '标签',
}, {
  key: 'Mark',
  label: '描述'
}, {
  key: 'Createtime',
  label: '创建时间',
}]

</script>

<template>
  <UDashboardNavbar title="我的店铺" :badge="data.Total" class=" border-0 ">
    <template #right>
      <UserFormStoreCreate @success="onCreate" />
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
    <template #Ico-data="{ row }">
      <BrandLogo :src="(row.Ico)" class="!w-[100px] !h-[100px]" />
    </template>
    <template #Background-data="{ row }">
      <BrandBackground :src="(row.Background)" />
    </template>
    <template #Tags-data="{ row }">
      <UBadge v-for="(tag, index) in row.Tags" :key="index" :label="tag" class="max-w-[200px] m-1" variant="soft" />
    </template>
    <template #Name-data="{ row }">
      <UButton variant="link" :to="`/user/resource/store/${row.Name}`">
        {{ row.Name }}
      </UButton>
    </template>
    <template #Createtime-data="{ row }">
      {{ format.dateTime((row.Createtime)) }}
    </template>
  </TableBase>
</template>
