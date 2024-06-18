<script setup lang="ts">

const { data, error, refresh, pending } = useAsyncData('dashboardApi.overview', dashboardApi.overview, {
  default: () => ({
    AllocateBucketSize: 0,
    BuketSurplusSize: 0,
    FileNum: 0,
    MonthFileSize: 0,
    QuotaSize: 0,
    TotalSize: 0,
    CurrentBucketNum: 0,
    BucketSurplusQuotaSize: 0,
  })
})


const info = computed(() => [
  {
    title: "文件数量",
    desc: "用户文件数量",
    icon: 'i-solar-clipboard-list-bold-duotone',
    data: Number(data.value.FileNum),
  },
  {
    title: "当前存储用量",
    desc: "用户当前存储用量",
    icon: 'i-solar-atom-bold-duotone',
    data: merticKB(data.value.TotalSize),
  },
  {
    title: "剩余可用容量",
    desc: "用户剩余可用容量",
    icon: 'i-solar-archive-down-bold-duotone',
    data: merticKB(data.value.BuketSurplusSize),
  },
  {
    title: "本月流量",
    desc: "用户本月使用流量",
    icon: 'i-solar-chart-2-bold-duotone',
    data: merticKB(data.value.MonthFileSize),
  },
  {
    title: "桶数量",
    desc: "用户桶数量",
    icon: 'i-solar-archive-up-bold-duotone',
    data: data.value.CurrentBucketNum,
  },
  {
    title: "当前桶配额总量",
    desc: "用户当前桶配额总量",
    icon: 'i-solar-bill-list-bold-duotone',
    data: merticKB(data.value.AllocateBucketSize),
  },
  {
    title: "剩余可配额量",
    desc: "用户剩余可配额量",
    icon: 'i-solar-archive-bold-duotone',
    data: merticKB(data.value.BucketSurplusQuotaSize),
  },
  {
    title: "用户配额总量",
    desc: "用户配额总量",
    icon: 'i-solar-archive-check-bold-duotone',
    data: merticKB(data.value?.QuotaSize),
  },
]);


</script>

<template>
  <!-- 载入 -->
  <div v-if="pending" class="grid grid-cols-4 gap-4 md:grid-cols-6 xl:grid-cols-8 px-5">
    <UCard v-for="(item, i) in Array(8).fill(1)" :key="i" class="col-span-2">
      <div class="flex items-center space-x-4">
        <div class="w-full space-y-2">
          <USkeleton class="h-4 w-1/3" />
          <USkeleton class="h-6 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </div>
    </UCard>
  </div>

  <!-- 异常 -->
  <ErrorCatch v-else-if="error" :error="error" @retry="refresh()" />

  <!-- 正常 -->
  <div v-else class="grid grid-cols-4 gap-4 md:grid-cols-6 xl:grid-cols-8 px-5">
    <UCard v-for="(item, i) in info" :key="i" class="col-span-2">
      <div>
        <div class="mb-2 flex items-center justify-between opacity-90">
          <p class="typography-p">
            {{ item.title }}
          </p>
          <div :class="item.icon ?? 'i-solar-chart-2-bold-duotone '" class="h-4 w-4" />
        </div>
        <h3 class="typography-h3">
          {{ item.data }}
          <!-- {{ $t(`user.dashboard.overview.${i}`) }} -->
        </h3>
        <small class="typography-muted">
          {{ item.desc }}
          <!-- {{ $t(`user.dashboard.overview.${i}`) }} -->
        </small>
      </div>
    </UCard>
  </div>
</template>
