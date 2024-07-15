<script setup lang="ts">
defineProps<{
  sider: {
    to: string
    icon: string
    label: string
  }[]
  bottom?: {
    to: string
    icon: string
    label: string
  }[]
}>()

const router = useRouter()

const page = usePageStore()
function setTitle(title: string) {
  page.setTitle(title)
}
</script>

<template>
  <aside class="fixed left-0 z-20 bg-gray-100 dark:bg-gray-950 flex flex-col h-full border-r inset-y w-[200px] px-4">
    <div class="flex items-center justify-center p-2">
      <Logo dark="/images/osca.svg" light="/images/osca.svg" class="size-20 invert dark:filter-none" />
    </div>
    <Separator />
    <nav class="grid gap-1 p-2">
      <TooltipProvider v-for="item in sider" :key="item.to">
        <Tooltip>
          <TooltipTrigger as-child>
            <NuxtLink :to="item.to">
              <Button :variant="router.currentRoute.value.fullPath.includes(item.to) ? 'default' : 'ghost'" class="flex items-center justify-start w-full gap-2 font-semibold tracking-wider" :aria-label="item.label" @click="setTitle(item.label)">
                <Iconify :icon="item.icon" class="size-5" :class="router.currentRoute.value.fullPath.includes(item.to) && 'text-primary-200'" />
                {{
                  item.label
                }}
              </Button>
            </NuxtLink>
          </TooltipTrigger>
          <TooltipContent side="right" :side-offset="5">
            {{ item.label }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
    <nav class="grid gap-1 p-2 mt-auto">
      <TooltipProvider v-for="item in bottom" :key="item.to">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="rounded-lg" :aria-label="item.label">
              <Iconify :icon="item.icon" class="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" :side-offset="5">
            {{ item.label }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  </aside>
</template>
