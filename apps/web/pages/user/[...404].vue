<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <section class="h-[calc(100vh-118px)] bg-gray-50 dark:bg-gray-900/50">
    <div class="flex items-center justify-center h-full max-w-screen-xl px-4 py-8 mx-auto lg:px-6 lg:py-16">
      <div class="max-w-screen-sm mx-auto text-center">
        <h1 class="mb-4 font-extrabold tracking-tight text-primary-600 dark:text-primary-500 text-7xl lg:text-9xl">
          404
        </h1>
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          无法找到该页面
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          不好意思，我们无法在网站中找到该页面，您可能正在访问的是个错误页面，您可以通过返回按钮回到主页中
        </p>
        <Button class="bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4" @click="router.back()">
          返回首页
        </Button>
      </div>
    </div>
  </section>
</template>
