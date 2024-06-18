<script setup lang="ts">
const route = useRoute()

const user = useUserStore()
// const toast = useToastHandle()

// 登录逻辑
async function submit(value: {
  Token: string
  Remember?: boolean
}) {
  try {
    // 存储token
    storage.SetItem('UToken', value.Token, value.Remember)

    // 获取用户信息
    await user.getUserInfo()
    navigateTo('/user/data/dashboard', {
      replace: true,
    })
  }
  catch (e: any) {
    toast.error(e.message)
  }
}

onMounted(() => {
  switch (route.query.state) {
    case 'none-token':
      // 用户未登录，跳转到登录页面
      toast.error('Token过期，请重新登录')
      break
  }
})
</script>

<template>
  <div class="mx-auto md:flex-row flex items-center w-full flex-col-reverse justify-between md:w-[750px] py-10">
    <div class="w-[300px] space-y-4">
      <div class="flex flex-col space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          登录
        </h1>
        <p class="text-sm text-muted-foreground">
          输入您的个人信息，即可登录到{{ website.name }}。
          更多关于我们的内容
          <a :href="website.official" target="_blank">
            <Button variant="link">
              查看官网
            </Button>
          </a>
        </p>
      </div>

      <!-- 登录表单 -->
      <Tabs default-value="account">
        <TabsList class="flex w-full mb-4">
          <TabsTrigger value="account" class="flex-1">
            账号
          </TabsTrigger>
          <TabsTrigger value="phone" class="flex-1">
            手机
          </TabsTrigger>
          <TabsTrigger value="email" class="flex-1">
            邮箱
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <FormLoginAccount @submit="submit" />
        </TabsContent>
        <TabsContent value="phone">
          <FormLoginPhone @submit="submit" />
        </TabsContent>
        <TabsContent value="email">
          <FormLoginEmail @submit="submit" />
        </TabsContent>
      </Tabs>
      <p class="px-8 text-sm text-center text-muted-foreground">
        没有账号？
        <NuxtLink href="/register">
          <Button variant="link">
            注册
          </Button>
        </NuxtLink>
      </p>
    </div>

    <Separator orientation="vertical" class="hidden md:flex" />
    <Separator class="md:hidden" />

    <div class="w-[300px] space-y-6">
      <div class="flex flex-col space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          Carsi
        </h1>
        <p class="text-sm text-muted-foreground">
          中国教育和科研计算机网联邦认证与资源共享基础设施，为已经建立校园网统一身份认证的高校和科研单位，提供联邦认证和全球学术信息资源共享服务。
        </p>
      </div>

      <Button class="w-full gap-4" variant="secondary" size="lg" @click="authApi.loginByOauth('carsipre', 'login')">
        <img src="/carsi.png" class="hidden w-6 h-6 dark:block">
        <img src="/carsi_blue.png" class="w-6 h-6 opacity-75 dark:hidden">
        Carsi 登录
      </Button>
      <Separator />

      <div class="flex flex-col space-y-2">
        <h1 class="text-2xl font-semibold tracking-tight">
          统一认证
        </h1>
        <p class="text-sm text-muted-foreground">
          来自高校的联合加盟，直接通过高校内部统一认证接入系统
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <Button variant="secondary" @click="authApi.loginByOauth('ihep', 'login')">
          高能所统一认证
        </Button>
        <Button variant="secondary" disabled>
          北航登录
        </Button>
      </div>

      <p class="px-8 text-sm text-center text-muted-foreground">
        如果您是审核人员的话，跳转到
        <a :href="website.auditUrl" target="_blank">
          <Button variant="link">
            审核页面
          </Button>
        </a>
      </p>
    </div>
  </div>
</template>
