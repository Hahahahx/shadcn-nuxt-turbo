<script setup lang="ts">
import type { LogInfo } from '~/api/log'
import Delete from '~/components/user/form/access-key/delete.vue'

// 搜索
const query = ref('')

const { history } = useThrottledRefHistory(query, {
  throttle: 2000,
  deep: true,
  trailing: true
})

const pageIndex = ref(1)
const pageSize = ref(10)

const { data, refresh, pending, error } = useAsyncData(
  'logApi.list', () => logApi.list({
    Page: pageIndex.value,
    PageSize: pageSize.value,
    Name: history.value?.at(0)?.snapshot
  }), {
  watch: [pageIndex, pageSize, history],
  default: (): Page.Response<LogInfo> => ({
    Rows: [],
    Total: 0
  }),
})


// 列表键
const columns: {
  key: keyof LogInfo
  label?: string
}[] = [{
  key: 'ObjectName',
  label: '对象名称',
}, {
  key: 'ObjectType',
  label: '对象类型',
}, {
  key: 'ObjectSize',
  label: '对象大小',
}, {
  key: 'LogTypeContent',
  label: '日志内容',
}, {
  key: 'Mtime',
  label: '操作时间',
}]


</script>

<template>
  <UDashboardNavbar title="操作日志" :badge="data.Total" class=" border-0">
    <template #right>
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
    :refresh="refresh"
  >
    <template #Mtime-data="{ row }">
      {{ format.dateTime(row.Mtime) }}
    </template>


    <template #ObjectSize-data="{ row }">
      <SizeBadge :size="row.ObjectSize ?? 0" />
    </template>
  </TableBase>
</template>
