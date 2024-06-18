<script setup lang="ts">

// 国际化
const { t } = useI18n()

const { data, refresh, pending ,error } = useAsyncData(
  'filerApi.list',
  filerApi.list,
  {
  default: (): FilerInfo[] => ([])
})

// 列表键
const columns: {
  key: keyof FilerInfo
  label?: string
}[] = [{
  key: 'Name',
  label: t('user.filer.field.name'),
}, {
  key: 'OSSAddress',
  label: t('user.filer.field.ossaddress'),
}]


const query = ref('')
const pageIndex = ref(1)
const pageSize = ref(10)

// 分页
const list = computed(() => {
  return data.value?.filter(i => i.Name?.includes(query.value)).slice((pageIndex.value - 1) * pageSize.value, pageIndex.value * pageSize.value) ?? []
})


</script>

<template>
  <UDashboardNavbar :title="$t('user.filer.address')" :badge="data.length" class=" border-0" />
  <TableBase
    $selected="selected"
    $query="query"
    $page-index="pageIndex"
    $page-size="pageSize"
    :loading="pending"
    :error="error"
    :list="list"
    :page-total="data?.length ?? 0"
    :columns="columns"
    :refresh="refresh"
  />
</template>
