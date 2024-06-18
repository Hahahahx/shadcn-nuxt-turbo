<script setup lang="ts">
onMounted(() => {
  if (storage.GetItem('UToken'))
    navigateTo('/user/data/dashboard')
  else
    navigateTo('/login')
})
</script>

<template>
  <NuxtPage />
</template>
