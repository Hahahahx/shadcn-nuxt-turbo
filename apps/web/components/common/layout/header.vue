<script setup lang="ts">
import { WindowServiceEvent } from '~/event'

// const page = usePageStore()

function onMin() {
  window.ipc.send(WindowServiceEvent.Min)
}

function onMax() {
  window.ipc.send(WindowServiceEvent.Max)
}

function onClose() {
  window.ipc.send(WindowServiceEvent.Close)
}
</script>

<template>
  <header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 px-4 drag">
    <!-- <h1 class="text-xl font-semibold">
      {{ page.title }}
    </h1> -->
    <div class="header" />
    <div class="ml-auto gap-1.5 text-sm" />
    <Flex justify-content="end" align-items="center" class="drag">
      <ThemeToggle />
      <Separator orientation="vertical" class="mx-2 h-7" />
      <Flex justify-content="end" align-items="center">
        <Button size="icon" variant="ghost" class="overflow-hidden " @click="onMin">
          <Iconify icon="mdi:minus" class=" size-5" />
        </Button>
        <Button size="icon" variant="ghost" class="overflow-hidden " @click="onMax">
          <Iconify icon="mdi:crop-square" class=" size-5" />
        </Button>
        <Button size="icon" variant="ghost" class="overflow-hidden " @click="onClose">
          <Iconify icon="mdi:close" class=" size-6" />
        </Button>
      </Flex>
    </Flex>
  </header>
</template>
