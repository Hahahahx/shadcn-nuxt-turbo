<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'


const { hot, category, tags, description, img, vertical, shadow, border, backgroundColor } = withDefaults(defineProps<{
  to?: string
  title: string
  img: string
  hot: number
  category: string
  tags: string[]
  description: string
  vertical?: boolean
  shadow?: boolean
  border?: boolean
  backgroundColor?: string | false
  time?:string
  compact?:boolean
  footer?:boolean
}>(), {
  vertical: true,
  shadow: false,
  border: true,
  backgroundColor: 'dark:bg-gray-900',
})


</script>


<template>
  <NuxtLink :to="to" class="h-full cursor-pointer" :class="[vertical ? 'col-span-1' : 'col-span-3']">
    <Card
      v-if="vertical"
      class="h-full "
      :class="[backgroundColor, shadow ? 'shadow' : '!shadow-none', border ? 'border border-gray-500/20' : '!border-0',compact ? 'shadow-none border-none !bg-transparent !ring-0':'hover:ring-2 hover:ring-primary/80']"
    >
      <CardHeader :class="[compact && 'flex flex-row gap-3 bg-white dark:bg-gray-900 border rounded-md  border-gray-500/20  hover:ring-2 hover:ring-primary/80']">
        <BrandLogo v-if="compact" :src="img" class="" />
        <div class="flex flex-col justify-between flex-shrink-0">
          <div>
            <CardTitle class="truncate text-base opacity-90  flex gap-2 items-center">
              {{ title || '未命名资源' }}
              <UBadge v-if="compact" variant="soft">
                {{ category }}
              </UBadge>
            </CardTitle>
            <CardDescription>{{ description || "暂无资源描述信息" }}</CardDescription>
          </div>
          <slot v-if="compact" name="header-bottom" v-bind="{ hot, category, tags,time }" />
        </div>
      </CardHeader>
      <CardContent v-if="!compact" class="flex flex-col gap-2 justify-center items-center ">
        <BrandLogo :src="img" />
      </CardContent>

      <div v-if="time" class="h-6 flex justify-center items-center typography-muted rounded-md  bg-gray-500/20">
        {{ time }}
      </div>
      <CardFooter v-if="!compact || footer">
        <UserSectionCardResourceFooter :hot="hot" :category="category" :tags="tags" vertical />
      </CardFooter>
    </Card>


    <Card
      v-else
      class="flex items-center"
      :class="[backgroundColor, shadow ? 'shadow' : '!shadow-none', border ? 'border' : '!border-0']"
    >
      <CardHeader>
        <BrandLogo :src="img" />
      </CardHeader>
      <CardContent class="flex flex-col gap-2 justify-center pt-6 flex-1">
        <CardTitle class="truncate text-lg">
          {{ title }}
        </CardTitle>
        <CardDescription>{{ description }}</CardDescription>

        <UserSectionCardResourceFooter :hot="hot" :category="category" :tags="tags" />
      </CardContent>
    </Card>
  </NuxtLink>
</template>
