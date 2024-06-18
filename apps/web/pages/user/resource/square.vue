<script setup lang="ts">

const {t} = useI18n()
const links = [[{
    label: '资源',
    // icon: 'i-carbon-settings',
    to: '/user/resource/square',
    exact: true
  }, {
    label: '店铺',
    // icon: '',
    to: '/user/resource/square/author',
  }]]
</script>

<template>
  <UDashboardToolbar class="py-5">
    <div>
      <h1 class="text-2xl font-semibold">
        资源广场
      </h1>
      <p class=" opacity-70">
        对开放资源的整合
      </p>
    </div>
  </UDashboardToolbar>
  <!-- <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" class=" justify-center" />
  </UDashboardToolbar> -->
  <NuxtPage />
</template>
