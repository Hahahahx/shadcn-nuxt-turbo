<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))



const links = computed(() => navigation.value.find((item) => item._path === '/user')?.children?.find(item=>item._path==='/user/settings')?.children?.find(item=>item._path==='/user/settings/help')?.children ?? [])

console.log(links.value)


onMounted(()=>{
  if( location.pathname.endsWith('/user/settings/help')){
    navigateTo(links.value.at(0)?._path)
  }

})

</script>

<template>
  <UContainer class="w-full">
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree :links="mapContentNavigation(links)" />
        </UAside>
      </template>

      <NuxtPage />
    </UPage>
  </UContainer>
</template>
