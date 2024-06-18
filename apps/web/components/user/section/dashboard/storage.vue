<script setup lang="ts">

const { data: buckets, pending: bucketPending } = useAsyncData(
  'dashboardApi.storageBucket', dashboardApi.storageBucket, {
  default: () => [],
  transform: (data) => {
    return [{
      Name: '全部信息'
    }, ...data]
  }
}
)

const selected = ref({
  Name: '全部信息'
})

const { data, error, pending } = useAsyncData(
  'dashboardApi.storage', () => dashboardApi.storage({
    BucketName: selected.value.Name !== '全部信息' ? selected.value.Name : undefined,
    isAll: selected.value.Name === '全部信息' ? 1 : undefined
  }), {
  watch: [selected],
  default: () => ({
    Name: '',
    FileNum: 0,
    TotalSize: 0,
    QuotaSize: 0,
    UsagePercent: 0,
    DocumentTypeSize: 0,
    MusicTypeSize: 0,
    PictureTypeSize: 0,
    VedioTypeSize: 0,
    OtherTypeSize: 0,
  }),
})


const size = computed(() => {
  return [
    { name: '文档', value: data.value.DocumentTypeSize },
    { name: '音频', value: data.value.MusicTypeSize },
    { name: '图片', value: data.value.PictureTypeSize },
    { name: '视频', value: data.value.VedioTypeSize },
    { name: '其他', value: data.value.OtherTypeSize },
  ]
})

</script>

<template>
  <UCard class="col-span-3" :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex justify-between">
        <div>
          <h4 class="typography-h4">
            存储空间
          </h4>
          <p class="typography-muted">
            在文件网关上所占用的存储空间
          </p>
        </div>
        <div>
          <USelectMenu
            v-model="selected"
            option-attribute="Name"
            by="Name"
            :options="buckets"
            :loading="bucketPending"
            class="w-[200px]"
          />
          <p class="typography-muted text-right">
            选择Bucket
          </p>
        </div>
      </div>
    </template>
    <div class="h-[300px]">
      <!-- 载入 -->
      <div v-if="pending" class="h-full w-full gap-4 pt-6 md:gap-6 flex justify-center overflow-hidden">
        <USkeleton class="h-full w-20" />
        <USkeleton class="h-full w-20" />
        <USkeleton class="h-full w-20" />
        <USkeleton class="h-full w-20" />
        <USkeleton class="h-full w-20" />
      </div>

      <!-- 异常 -->
      <ErrorCatch v-else-if="error" :error="error" class="h-full" />

      <!-- 正常 -->
      <UserEchartBucket v-else :data="size" />
    </div>
    <template #footer>
      <UMeterGroup :max="data.QuotaSize">
        <template #indicator>
          <div class="flex justify-between gap-1.5 text-sm">
            <p class="text-gray-500 dark:text-gray-400">
              {{ byteTrans.merticKB(data.TotalSize) }} 已使用
            </p>
            <p class="text-gray-500 dark:text-gray-400">
              {{ byteTrans.merticKB(data.QuotaSize) }} 配额空间
            </p>
          </div>
        </template>
        <UMeter :value="data.TotalSize" color="gray" label="全部文件" icon="i-heroicons-cog-6-tooth" />
      </UMeterGroup>
    </template>
  </UCard>
</template>
