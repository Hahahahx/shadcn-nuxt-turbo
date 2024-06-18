<script setup lang="ts">
definePageMeta({
  layout: false,
})

// const { data: page } = await useAsyncData("/content/privacy", () => queryContent("/content/privacy").findOne())
// if (!page.value) {
//   throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
// }
</script>

<template>
  <div>
    <PageHeader
      class="max-w-2xl mx-auto"
      title="隐私政策"
      :breadcrumb="[{
        label: '回到登录',
        icon: 'i-heroicons-home',
        to: '/login',
      }, {
        label: '隐私政策',
        disabled: true,
      }]"
    >
      <template #actions>
        <NuxtLink to="/login">
          <Logo />
        </NuxtLink>
      </template>
    </PageHeader>
    <ContentDoc path="/privacy" class="p-6 mx-auto my-2 prose prose-primary dark:prose-invert" />
  </div>
</template>
