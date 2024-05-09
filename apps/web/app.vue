<script setup lang="ts">
const md = `
::alert
Hello MDC
::
`
</script>

<template>
  <div>
    <Button class="">
      test
    </Button>
    <MDC :value="md" tag="article" />
    <ContentDoc path="/about" />
  </div>
</template>
