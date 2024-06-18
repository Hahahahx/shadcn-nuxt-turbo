<script setup>
definePageMeta({
  layout: 'user',
  middleware: 'auth',
})

const user = useUserStore()
const toast = useToastHandle()

effect(async () => {
  if (process.client) {
    try {
      await user.getUserInfo()
    }
    catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }
})
</script>

<template>
  <NuxtPage />
</template>
