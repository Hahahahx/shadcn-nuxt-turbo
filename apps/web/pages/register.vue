<script setup lang="ts">
const toast = useToastHandle()

function submit() {
  toast.success('注册成功，请前往您的邮箱校验，并等待管理员审核您的账号信息。')
  navigateTo('/login')
}
</script>

<template>
  <div class="lg:p-8">
    <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          注册
        </h1>
        <p class="text-sm text-muted-foreground">
          输入您的个人信息，注册到{{ website.name }}。
        </p>
      </div>
      <UDivider />
      <p class="px-8 text-sm text-center text-muted-foreground">
        请仔细阅读
        <NuxtLink href="/privacy">
          <UButton variant="link">
            隐私政策
          </UButton>
        </NuxtLink>
      </p>

      <FormLoginReigster @submit="submit" />

      <p class="px-8 text-sm text-center text-muted-foreground">
        已有账号？
        <NuxtLink href="/login">
          <UButton variant="link">
            登录
          </UButton>
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
