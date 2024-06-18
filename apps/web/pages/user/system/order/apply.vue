<script setup lang="ts">


// 国际化
const { t } = useI18n()
// 选中的数据
const selected = ref<Order.OrderInfo[]>([])
// 搜索
const query = ref('')
// 模态框组件
const modal = useModal()
// 提示组件
const toast = useToastHandle()

const { data, refresh, pending } = useAsyncData(
  API.user.system.order.cacheKey.list,
  () => API.user.system.order.list({
    // 查询参数
  }), {
  default: (): Order.List['Res'] => ({
    ListInfo: {
      Fields: {},
      Search: [],
      Sort: []
    },
    Page: 0,
    Total: 0,
    Items: []
  })
})

// 列表键
const columns: {
  key: keyof Order.OrderInfo
  label?: string
}[] = [{
  key: 'UserName',
  label: t('user.order.apply.field.title'),
}, {
  key: 'Title',
  label: t('user.order.apply.field.type'),
}, {
  key: 'Status',
  label: t('user.order.apply.field.content'),
}, {
  key: 'ReplyContent',
  label: t('user.order.apply.field.result'),
}, {
  key: 'CreateTime',
  label: t('user.order.apply.field.assessor'),
}, {
  key: 'CreateTime',
  label: t('user.order.apply.field.createtime'),
}]

</script>

<template>
  <UDashboardNavbar :title="$t('user.order.apply.title')" :badge="data?.Items?.length" class=" border-0">
    <template #right>
      <UserFormBucketCreate @create="onCreate" />
    </template>
  </UDashboardNavbar>
  <TableBase
    v-model:selected="selected"
    v-model:query="query"
    :loading="pending"
    :list="data?.Items ?? []"
    :page-total="data?.Items?.length || 0"
    :columns="columns"
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
  </TableBase>
</template>
