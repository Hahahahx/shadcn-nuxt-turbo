<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  sider?: Config['userSider']
}>()
</script>

<template>
  <div class="flex flex-col h-full max-h-screen gap-2">
    <div class="flex h-18 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <NuxtLink to="/user/data/dashboard" class="flex justify-center w-full">
        <Logo />
      </NuxtLink>
    </div>
    <div class="flex-1">
      <div v-for="item in sider" :key="item.group" class="px-4 mb-8">
        <div class="pb-4 text-sm font-bold text-gray-500 opacity-40 dark:text-gray-100">
          {{ item.group }}
        </div>

        <!-- <UDashboardSidebarLinks :links="item.list" /> -->
        <div v-for="(link, index) in item.list" :key="index">
          <NuxtLink :to="link.to" class="block w-full" :target="link.target">
            <Button
              :variant="$route.fullPath.includes(link.to) ? 'secondary' : 'ghost'"
              class="justify-start w-full gap-2 my-1"
              :trailing="false"
            >
              <Icon :icon="link.icon" />
              {{ link.label }}
            </Button>
          </NuxtLink>
          <div>
            <slot :name="link.key" />
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 mt-auto">
      <div class="w-full md:space-y-4">
        <LayoutSiderStorage class="hidden xl:block" />
        <UDivider class="sticky bottom-0" />
        <!-- ~/components/UserDropdown.vue -->
        <!-- <LayoutSiderUser /> -->
      </div>
    </div>
  </div>
</template>
