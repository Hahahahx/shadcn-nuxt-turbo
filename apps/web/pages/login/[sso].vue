<script setup lang="ts">
const route = useRoute()
const sso = route.params.sso as string

const { data, pending, error } = useAsyncData(() => {
  if (route.query.state as string === 'bind')
    return userApi.bindSSO(sso)

  return authApi.callbackSSO(sso, {
    Code: route.query.code as string,
  })
})

effect(() => {
  if (!pending && !error) {
    // 如果是绑定第三方则回到设置页面
    if (route.query.state === 'bind') {
      setTimeout(() => {
        navigateTo('/user/setting')
      }, 2000)
    }
    else {
      // 登录成功
      if (data.value?.Token) {
        storage.SetItem('UToken', data.value?.Token, true)
        navigateTo('/user/data/dashboard')
        // 登录失败
      }
      else {
        setTimeout(() => {
          navigateTo('/login')
        }, 2000)
      }
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <UIcon name="" />
    载入中...
  </div>
</template>
