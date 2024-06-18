<script setup lang="ts">

const { data, error, pending } = useAsyncData(
  'filerApi.list',
  filerApi.list,
  {
  default: (): FilerInfo[] => ([])
})


const { copy } = useClipboard()
</script>


<template>
  <UCard class="col-span-3 flex flex-col" :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex justify-between">
        <h4 class="typography-h4">
          {{ $t("user.dashboard.filer") }}
        </h4>
      </div>
      <p class="typography-muted">
        {{ $t("user.dashboard.filer.desc") }}
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
      :links="data"
      class="scrollbar-default h-[280px] max-h-[280px] w-full overflow-auto p-2"
      :ui="{
        label: 'truncate relative text-gray-900 dark:text-white flex-initial w-32 text-left',
      }"
    >
      <template #badge="{ link }">
        <div class="relative flex gap-4 truncate">
          <UBadge variant="soft">
            {{ link.Name }}
          </UBadge>
          <UTooltip text="点击复制">
            <span @click="copy(link.OSSAddress)">{{ (link.OSSAddress) }}</span>
          </UTooltip>
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
