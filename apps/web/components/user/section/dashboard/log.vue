<script setup lang="ts">
const { data, refresh, pending, error } = useAsyncData(
  'logApi.list', () => logApi.list({
    Page: 0,
    PageSize: 10,
  }), {
    default: (): Page.Response<LogInfo> => ({
      Rows: [],
      Total: 0,
    }),
  })
</script>

<template>
  <UCard class="flex flex-col col-span-2" :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex justify-between">
        <h4 class="typography-h4">
          操作日志
        </h4>
      </div>
      <p class="typography-muted">
        当前用户在系统所执行的操作记录
      </p>
    </template>
    <div v-if="pending" class="h-[280px] w-full space-y-2 p-4 overflow-hidden">
      <Skeleton class="w-full h-10" />
      <Skeleton class="w-full h-10" />
      <Skeleton class="w-full h-10" />
      <Skeleton class="w-full h-10" />
      <Skeleton class="w-full h-10" />
    </div>

    <ErrorCatch v-else-if="error" :error="error" class="h-[280px]" />

    <div v-else class="flow-root mt-4 mx-auto max-h-[325px] overflow-y-auto">
      <div class="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="item in data.Rows" :key="item.Mtime" class="grid grid-cols-3 gap-2 p-4 px-6">
          <p class="text-sm font-normal text-gray-500 truncate dark:text-gray-400">
            {{ format.dateTime(item.Mtime) }}
          </p>
          <h3 class="font-semibold text ">
            <a href="#" class="hover:underline">{{ item.LogTypeContent }}</a>
          </h3>
          <Badge variant="secondary">
            {{ item.ObjectName }}
          </Badge>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <NuxtLink to="/user/log">
          <Button color="gray">
            查看更多
          </Button>
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>
