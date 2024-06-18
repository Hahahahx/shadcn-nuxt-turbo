<script setup lang="ts">


const { data, error, pending } = useAsyncData(
  API.user.data.dashboard.cacheKey.order, API.user.data.dashboard.order
)

const appConfig = useAppConfig()
</script>


<template>
  <UCard class="col-span-2 flex flex-col" :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex justify-between">
        <h4 class="typography-h4">
          {{ $t("user.dashboard.order") }}
        </h4>
      </div>
      <p class="typography-muted">
        {{ $t("user.dashboard.order.desc") }}
      </p>
    </template>
    <div v-if="pending" class="h-[280px] w-full space-y-2 p-4 overflow-hidden">
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-10 w-full" />
    </div>

    <ErrorCatch v-else-if="error" :error="error" class="h-[280px]" />

    <UVerticalNavigation
      v-else
      :links="data?.Items??[]"
      class="scrollbar-default h-[280px] max-h-[280px] w-full overflow-auto p-2"
      :ui="{
        label: 'truncate relative text-gray-900 dark:text-white flex-initial w-32 text-left',
      }"
    >
      <template #badge="{ link }">
        <div class="relative flex flex-1 flex-col justify-start items-end truncate">
          {{ link.Title }}
          <UBadge variant="soft">
            {{ link.Status }}
          </UBadge>
          <div>{{ format.dateTime(link.UpdateTime) }}</div>
        </div>
      </template>
    </UVerticalNavigation>



    <template #footer>
      <div class="flex justify-end">
        <ULink to="/user/log">
          <UButton color="gray">
            {{ $t("hint.view-more") }}
          </UButton>
        </ULink>
      </div>
    </template>
  </UCard>
</template>
