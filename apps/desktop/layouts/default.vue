<script setup lang="ts">

</script>

<template>
  <div class="h-screen flex flex-col pt-[100px] md:pt-0">
    <main class="flex flex-col items-center justify-center flex-1">
      <header class="flex  justify-center h-[100px] items-center">
        <h1 class=" typography-h2">
          LOGO
        </h1>
      </header>
      <slot />
    </main>

    <footer class="h-[100px]">
      <p class="flex items-center justify-center px-8 text-sm text-center text-muted-foreground">
        <ColorMode />
      </p>
      <p class="px-8 text-sm text-center text-muted-foreground">
        请仔细阅读
        <NuxtLink href="/privacy">
          <Button variant="link">
            隐私政策
          </Button>
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>
