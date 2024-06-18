<script setup lang="ts">
import deleteVue from '~/components/user/form/bucket/delete.vue'
import editVue from '~/components/user/form/bucket/edit.vue'

// 国际化
const { t } = useI18n()
// 选中的数据
const selected = ref<BucketInfo[]>([])
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
  'bucketApi.list', () => bucketApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<BucketInfo> => ({
    Rows: [],
    Total: 0
  }),

})


// 删除
const onDelete = async (ids: string[]) => {
  try {
    for (const i of ids) {
      await bucketApi.delete(i)
    }
    refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}

// 编辑
const onEdit = async (item: BucketCreateAndEditParams) => {
  try {
    await bucketApi.edit(item)
    refresh()
  } catch (e: any) {
    toast.error(e.message)
  }

}

// 创建
const onCreate = async (item: BucketCreateAndEditParams) => {
  try {
    await bucketApi.create(item)
    refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}

// 列表操作菜单
function menus(row: BucketInfo) {
  return [
    [{
      label: t('table.action.detail'),
      icon: 'i-heroicons-arrow-right-circle-20-solid',
      to: `/user/data/bucket/${row.Name}`,
      show: true
    }, {
      label: t('table.action.edit'),
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => {
        modal.open(editVue, {
          row,
          onEdit
        })
      }
    }],
    [{
      label: t('user.bucket.table.action.recycle'),
      icon: 'i-heroicons-archive-box-20-solid',
      to: `/user/data/bucket/recycle/${row.Name}`,
      show: true,
    }],
    [{
      label: t('table.action.delete'),
      icon: 'i-heroicons-trash-20-solid',
      click: () => {
        modal.open(deleteVue, {
          row,
          onDelete
        })
      }
    }],
  ]
}


// 列表键
const columns: {
  key: keyof BucketInfo
  label?: string
}[] = [{
  key: 'Name',
  label: t('user.bucket.field.name'),
}, {
  key: 'TotalSize',
  label: t('user.bucket.field.size'),
}, {
  key: 'QuotaSize',
  label: t('user.bucket.field.quota'),
}, {
  key: 'FileNum',
  label: t('user.bucket.field.count'),
}]


</script>

<template>
  <UDashboardNavbar :title="$t('user.bucket.title')" :badge="data.Total" class=" border-0">
    <template #right>
      <UserFormBucketCreate @create="onCreate" />
      <NuxtLink href="/user/system/access-key">
        <UButton label="查看密钥" trailing-icon="i-heroicons-key-20-solid" color="gray" />
      </NuxtLink>
    </template>
  </UDashboardNavbar>
  <TableBase
    $selected="selected"
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
    <template #filter>
      <!--
        <USelectMenu
        icon="i-heroicons-check-circle"
        placeholder="Status"
        multiple
        :options="defaultStatuses"
        :ui-menu="{ option: { base: 'capitalize' } }"
      />
      <USelectMenu icon="i-heroicons-map-pin" placeholder="Location" :options="defaultLocations" multiple />
     -->
    </template>

    <template #selected>
      <div v-if="!!selected.length">
        <UButton variant="link" @click="() => onDelete(selected.map(i => i.Name))">
          删除
        </UButton>
      </div>
    </template>


    <template #QuotaSize-data="{ row }">
      <SizeBadge :size="row.QuotaSize ?? 0" />
    </template>

    <template #TotalSize-data="{ row }">
      <SizeBadge :size="row.TotalSize ?? 0" />
    </template>

    <template #Name-data="{ row }">
      <ULink :to="`/user/data/bucket/${row.Name}`">
        <UButton variant="link">
          {{ row.Name }}
        </UButton>
      </ULink>
    </template>
  </TableBase>
</template>
