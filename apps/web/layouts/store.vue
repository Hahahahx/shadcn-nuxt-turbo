<template>
  <UDashboardLayout>
    <UDashboardPage>
      <UDashboardPanel grow>
        <!-- 头部 -->
        <UDashboardNavbar class="container border-0">
          <template #title>
            <Logo />

            <!-- <UContentSearchButton class="md:flex hidden w-52" :label="$t('search')" /> -->
            <!-- <UDashboardSearchButton class="w-[300px]" /> -->
          </template>
          <template #right>
            <!-- <UDocsSearchButton class="rounded-md" size="sm" /> -->
            <!-- <UContentSearchButton class="flex md:hidden" variant="link" :label="$t('search')" /> -->
            <UColorModeButton />
            <!-- <LayoutUserNav /> -->
          </template>
        </UDashboardNavbar>

        <!-- 内容 -->
        <UPage class="overflow-y-auto pb-10">
          <slot />
          <UDivider />
          <UFooter>
            <template #left>
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                © 2023-2024 IHEP.
              </p>
              <UColorModeButton />
            </template>
          </UFooter>
        </UPage>
      </UDashboardPanel>
    </UDashboardPage>
  </UDashboardLayout>
</template>
