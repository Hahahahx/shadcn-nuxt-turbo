<script setup lang="ts">
import Delete from '~/components/user/form/access-key/delete.vue'


// 国际化
const { t } = useI18n()
// 选中的数据
const selected = ref<AccessKeyInfo[]>([])
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
  'accessKeyApi.list', () => accessKeyApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<AccessKeyInfo> => ({
    Rows: [],
    Total: 0
  }),
})


// 删除
const onDelete = async (row: AccessKeyInfo) => {
  await verify.identity(async () => {
    await accessKeyApi.delete(row)
    await refresh()
  })
}

const verify = useVerify()

// 创建
const onCreate = async (data: AccessKeyCreate) => {
  await verify.identity(async () => {
    await accessKeyApi.create(data)
    await refresh()
  })
}


// 显示密钥
const onShow = async (row: AccessKeyInfo) => {
  await verify.identity(async () => {
    const res = await accessKeyApi.show(row)
    data.value.Rows.forEach(item => {
      if (item.AccessKey === row.AccessKey) {
        item.SecretKey = res.SecretKey
      }
    })
  })
}

// 隐藏密钥
const onHide = async (row: AccessKeyInfo) => {
  data.value.Rows.forEach(item => {
    if (item.AccessKey === row.AccessKey) {
      item.SecretKey = ''
    }
  })
}

// 列表操作菜单
function menus(row: AccessKeyInfo) {
  return [
    [{
      label: '删除',
      show: true,
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
  key: keyof AccessKeyInfo
  label?: string
}[] = [{
  key: 'AccessKey',
  label: 'AccessKey',
}, {
  key: 'SecretKey',
  label: 'SecretKey',
}, {
  key: 'Expiration',
  label: '过期时间',
}]


</script>

<template>
  <UDashboardNavbar title="密钥管理" :badge="data.Total" class=" border-0">
    <template #right>
      <UserFormAccessKeyCreate @create="onCreate" />
      <!-- <UButton label="创建密钥" trailing-icon="i-heroicons-plus" color="gray" @click="onCreate" /> -->
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
    <template #Expiration-data="{ row }">
      {{ row.Expiration == -1 ? '永久有效' : format.dateTime(row.Expiration) }}
    </template>
    <template #SecretKey-data="{ row }">
      <div class="flex gap-2 justify-start items-center">
        <UButton v-if="!row.SecretKey" variant="ghost" icon="i-solar-eye-closed-bold-duotone" @click="onShow(row)" />
        <UButton v-else variant="ghost" icon="i-solar-eye-line-duotone" @click="onHide(row)" />
        {{ row.SecretKey || '****************' }}
      </div>
    </template>
  </TableBase>
</template>
