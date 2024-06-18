<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'

const { notices } = useNoticeStore()

const state = {
  loading: 'i-line-md-uploading-loop',
  error: 'i-solar-cloud-cross-bold-duotone text-rose-500',
  success: 'i-solar-archive-up-minimlistic-bold-duotone text-green-500',
}
</script>

<template>
  <UDashboardSlideover v-model="" title="Notifications">
    <div
      v-for="(notice, i) in notices" :key="i"
      class="relative flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <UChip color="red" :show="false" inset>
        <div :class="state[notice.state]" />
        <!-- <UAvatar v-bind="notification.sender.avatar" :alt="notification.sender.name" size="md" /> -->
      </UChip>

      <div class="flex-1 text-sm">
        <p class="flex items-center justify-between">
          <span class="font-medium text-gray-900 dark:text-white">{{ notice.title }}</span>

          <time
            :datetime="notice.time" class="text-xs text-gray-500 dark:text-gray-400"
            v-text="formatTimeAgo(notice.time)"
          />
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          {{ notice.desc }}
        </p>
      </div>
    </div>
  </UDashboardSlideover>
</template>
