<script setup lang="ts">
const { userInfo } = useUserStore()
</script>

<template>
  <div class="px-5 h-[2000px]">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <NuxtLink to="/user/settings" class="w-full">
            <UAlert
              description="美好的一天才刚刚开始，欢迎回来"
              :avatar="{ alt: userInfo?.NickName }"
              :title="userInfo?.NickName"
              :close-button="{ icon: 'i-carbon-settings', color: 'gray', variant: 'link', padded: false, inactiveClass: 'hover:animate-spin hover:text-primary' }"
              class="mt-8 -z-1"
              variant="soft"
            />
          </NuxtLink>
        </TooltipTrigger>
        <TooltipContent>
          <p>跳转到个人设置页面</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>

  <Separator class="my-6" />

  <PageHeader description="当前用户的资源存储信息">
    <template #title>
      <h3 class="typography-h3">
        资源概览
      </h3>
    </template>
  </PageHeader>

  <UserSectionDashboardResource />

  <Separator class="py-4" />

  <PageHeader description="当前用户在文件网关上所占用的存储空间，以及其他信息">
    <template #title>
      <h3 class="typography-h3">
        数据存储
      </h3>
    </template>
  </PageHeader>

  <div class="grid grid-cols-1 gap-4 px-5 md:grid-cols-4 lg:grid-cols-5">
    <!-- <UserSectionDashboardStorage /> -->
    <UserSectionDashboardLog />
    <!-- <UserSectionDashboardFiler /> -->
    <!--
    <UserSectionDashboardOrder /> -->
  </div>
</template>
