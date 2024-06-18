<script setup lang="ts">
import type { RecycledInfo } from '~/api/bucket'
import Delete from '~/components/user/form/bucket/recycle/delete.vue'
import Restore from '~/components/user/form/bucket/recycle/restore.vue'

const route = useRoute()
const modal = useModal()
const selected = ref<RecycledInfo[]>([])
const query = ref('')
const { t } = useI18n()
const toast = useToastHandle()

const { history } = useThrottledRefHistory(query, {
  throttle: 2000,
  deep: true,
  trailing: true
})

const pageIndex = ref(1)
const pageSize = ref(10)

const names = computed(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id
  }
  return [route.params.id]
})

const { data, refresh, pending, error } = useAsyncData(
  () => bucketApi.recycle.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot,
    BucketName: names.value.join('/'),
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<RecycledInfo> => ({
    Rows: [],
    Total: 0
  }),
})


const columns: {
  key: keyof RecycledInfo
  label?: string
  sortable?: boolean
}[] = [{
  key: 'Name',
  label: t('user.bucket.detail.field.name'),
  sortable: true
}, {
  key: 'FileSize',
  label: t('user.bucket.detail.field.size'),
  sortable: true
}, {
  key: 'Type',
  label: t('user.bucket.detail.field.type'),
  sortable: true
}, {
  key: 'DeleteTime',
  label: '删除时间',
}, {
  key: 'RecycleEffectTime',
  label: '恢复有效时间',
}]


const links = [{
  label: t('user.bucket.title'),
  icon: 'i-heroicons-home',
  to: '/user/data/bucket'
}, ...names.value.map((name, index) => ({
  label: name,
  to: '/user/data/bucket/' + names.value.slice(0, index + 1).join('/')
}))]


// 删除
const onDelete = async (row: RecycledInfo) => {
  try {
    await bucketApi.recycle.delete(row)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}


// 创建
const onRestore = async (row: RecycledInfo) => {
  try {
    await bucketApi.recycle.restore(row)
    await refresh()
  } catch (e: any) {
    toast.error(e.message)
  }
}


function menus(row: FileInfo) {
  return [
    [{
      label: '恢复文件',
      icon: 'i-heroicons-arrow-path-rounded-square-16-solid',
      click: () => {
        modal.open(Restore, {
          row,
          onRestore
        })
      }
    }],
    [{
      label: '永久删除',
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


</script>

<template>
  <PageTitle :title="names.at(-1)" :badge="data.Total" />
  <div class="px-4 pb-6">
    <UBreadcrumb :links="links" />
  </div>
  <TableBase
    $query="query"
    $page-index="pageIndex"
    $page-size="pageSize"
    :loading="pending"
    :error="error"
    :list="data.Rows ?? []"
    :page-total="data.Total"
    :columns="columns"
    :menus="menus"
    :refresh="refresh"
  >
    <template #FileSize-data="{ row }">
      <SizeBadge :size="row.FileSize ?? 0" />
    </template>

    <template #DeleteTime-data="{ row }">
      {{ format.dateTime((row.DeleteTime)) }}
    </template>

    <template #RecycleEffectTime-data="{ row }">
      {{ row.RecycleEffectTime }}天
    </template>
  </TableBase>
</template>
