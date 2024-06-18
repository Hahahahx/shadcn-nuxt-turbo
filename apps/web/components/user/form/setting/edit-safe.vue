<script setup lang="ts">

const user = useUserStore()
const toast = useToastHandle()
const { identityCheck } = useVerify()
const loading = ref(false)
const toggle = computed(()=>{
  return (!!user.userInfo.IsSafeCheck)
})
async function onClick() {
  loading.value = true
  await identityCheck(async () => {
    try {
      await userApi.edit({ IsSafeCheck: user.userInfo.IsSafeCheck ? 2 : 1 })
      user.getUserInfo()
    } catch (e: any) {
      toast.error(e.message)
    }
  })
  loading.value = false
}


</script>


<template>
  <div class="flex justify-end gap-2 items-center">
    <span class="typography-muted">
      {{ user.userInfo.IsSafeCheck ? "已开启" : "未开启" }}
    </span>
    <UToggle
      v-model="toggle"
      :on-icon="loading?'i-eos-icons-three-dots-loading':'i-heroicons-check-20-solid'"
      :off-icon="loading?'i-eos-icons-three-dots-loading':'i-heroicons-x-mark-20-solid'"
      :disabled="loading"
      size="xl"
      @click="onClick"
    />
  </div>
</template>
