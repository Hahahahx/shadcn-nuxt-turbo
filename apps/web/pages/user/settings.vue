<script setup lang="ts">
// const { t } = useI18n()
const links = [[{
  label: '个人设置', // t('menu.setting'),
  icon: 'i-carbon-settings',
  to: '/user/settings',
  exact: true,
},
  //  {
  //   label: t('menu.help'),
  //   icon: 'i-carbon-help',
  //   to: '/user/settings/help'
  // }, {
  //   label: t('menu.version'),
  //   icon: 'i-carbon-account',
  //   to: '/user/settings/version'
  // }
], [{
  label: '文档', // t('menu.documentation'),
  icon: 'i-heroicons-book-open',
  to: website.docsUrl,
  target: '_blank',
}, {
  label: '官网', // t('menu.portal'),
  icon: 'i-heroicons-credit-card',
  to: website.official,
  target: '_blank',
}]]
</script>

<template>
  <UDashboardToolbar class="py-5">
    <div>
      <h1 class="text-2xl font-semibold">
        {{ 'setting.title' }}
      </h1>
      <p class=" opacity-70">
        {{ 'setting.desc' }}
      </p>
    </div>
  </UDashboardToolbar>
  <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links" />
  </UDashboardToolbar>

  <NuxtPage />
</template>
