<script lang="ts" setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <ClientOnly>
    <Button color="gray" size="icon" variant="ghost" aria-label="Theme" @click="isDark = !isDark">
      <Iconify icon="lucide:sun-moon" class="transition-all scale-100 rotate-0 size-5 dark:-rotate-90 dark:scale-0" />
      <Iconify icon="lucide:moon-star" class="absolute transition-all scale-0 rotate-90 size-5 dark:rotate-0 dark:scale-100" />
      <span class="sr-only">
        Toggle theme
      </span>
    </Button>
  </ClientOnly>
</template>
